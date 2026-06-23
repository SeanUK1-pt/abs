/**
 * WordPress → Payload CMS Migration Script
 *
 * Connects to WordPress MySQL via SSH tunnel, pulls all boat listings,
 * downloads images, and imports into the local Payload CMS instance.
 *
 * Usage:
 *   npx tsx src/migrations/wordpress-import.ts
 *
 * Prerequisites:
 *   - Payload dev server NOT running (this script starts its own connection)
 *   - MongoDB running locally
 *   - SSH key at ~/.ssh/id_ed25519 authorised on the server
 */

import { createTunnel } from 'tunnel-ssh'
import mysql from 'mysql2/promise'
import * as fs from 'fs'
import * as path from 'path'
import * as https from 'https'
import * as http from 'http'
import { getPayload } from 'payload'
import payloadConfig from '../payload.config'
import type { Server } from 'net'

// ── Config ────────────────────────────────────────────────────────────────────

const SSH_CONFIG = {
  host: 'algarveboatrental.com',
  port: 22,
  username: 'administrator',
  privateKey: fs.readFileSync(path.join(process.env.HOME || '~', '.ssh', 'id_ed25519')),
}

const MYSQL_CONFIG = {
  host: '127.0.0.1',
  user: 'wp_user_abs',
  password: 'ABS_1302_dwqis',
  database: 'wp_abs_99483',
}

const LOCAL_TUNNEL_PORT = 13307
const WP_UPLOAD_BASE = 'http://algarveboatsales.com/wp-content/uploads'
const IMAGE_DIR = path.join(process.cwd(), 'migration', 'images')
const REPORT_PATH = path.join(process.cwd(), 'migration', 'report.json')

// ── Field mapping ─────────────────────────────────────────────────────────────

const BOAT_TYPE_MAP: Record<string, string> = {
  'rigid-inflatable': 'rib',
  'rigid-inflatable-power-boat': 'rib',
  'bow-rider': 'bow_rider',
  'bowrider': 'bow_rider',
  'sports-cuddy': 'sports_cruiser',
  'sports-boat': 'sports_cruiser',
  'power-boat': 'power_boat',
  'sailboat': 'sailboat',
  'personal-watercraft': 'pwc',
  'aluminium-hull': 'aluminium_hull',
}

const FUEL_MAP: Record<string, string> = {
  'petrol': 'petrol',
  'diesel': 'diesel',
  'electric': 'electric',
  'hybrid': 'hybrid',
}

const DRIVE_MAP: Record<string, string> = {
  'outboard': 'outboard',
  'inboard': 'inboard',
  'sterndrive': 'sterndrive',
  'stern-drive': 'sterndrive',
  'jet': 'jet',
  'jet-drive': 'jet',
}

const HULL_MAP: Record<string, string> = {
  'grp-fibreglass': 'grp',
  'rigid-inflatable-rhib': 'rib',
  'aluminium': 'aluminium',
  'steel': 'steel',
  'wood': 'wood',
  'carbon-fibre': 'carbon',
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[áàãâä]/g, 'a').replace(/[éèêë]/g, 'e')
    .replace(/[íìîï]/g, 'i').replace(/[óòõôö]/g, 'o')
    .replace(/[úùûü]/g, 'u').replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest)
    const get = url.startsWith('https') ? https.get : http.get
    get(url, { timeout: 15000 }, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close()
        fs.unlinkSync(dest)
        return downloadFile(res.headers.location!, dest).then(resolve).catch(reject)
      }
      if (res.statusCode !== 200) {
        file.close()
        fs.unlinkSync(dest)
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`))
      }
      res.pipe(file)
      file.on('finish', () => file.close(() => resolve()))
    }).on('error', e => {
      fs.unlinkSync(dest)
      reject(e)
    })
  })
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function run() {
  fs.mkdirSync(IMAGE_DIR, { recursive: true })
  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true })

  const report: {
    succeeded: any[]
    failed: any[]
    skipped: any[]
    image_errors: any[]
  } = { succeeded: [], failed: [], skipped: [], image_errors: [] }

  console.log('📡 Opening SSH tunnel...')
  const [server] = await createTunnel(
    { autoClose: true, reconnectOnError: false },
    { port: LOCAL_TUNNEL_PORT },
    SSH_CONFIG,
    { dstAddr: MYSQL_CONFIG.host, dstPort: 3306 }
  ) as [Server, any]

  console.log(`✅ Tunnel open on localhost:${LOCAL_TUNNEL_PORT}`)

  const db = await mysql.createConnection({
    host: '127.0.0.1',
    port: LOCAL_TUNNEL_PORT,
    user: MYSQL_CONFIG.user,
    password: MYSQL_CONFIG.password,
    database: MYSQL_CONFIG.database,
    charset: 'utf8mb4',
  })

  console.log('✅ MySQL connected')

  // ── Pull all published boat listings ──────────────────────────────────────
  const [posts] = await db.execute<any[]>(
    `SELECT ID, post_title, post_content, post_name, post_date
     FROM wp_posts
     WHERE post_type = 'listings' AND post_status = 'publish'
     ORDER BY ID`
  )

  console.log(`📋 Found ${posts.length} listings`)

  // ── Pull all postmeta in one query ────────────────────────────────────────
  const postIds = posts.map(p => p.ID)
  const [allMeta] = await db.execute<any[]>(
    `SELECT post_id, meta_key, meta_value FROM wp_postmeta
     WHERE post_id IN (${postIds.join(',')})
     AND meta_key NOT LIKE 'car_views_stat%'
     AND meta_key NOT LIKE '_oembed%'
     AND meta_key NOT LIKE '_wpb%'
     AND meta_key NOT LIKE '_elementor%'`
  )

  // ── Pull taxonomy terms for all posts ────────────────────────────────────
  const [allTerms] = await db.execute<any[]>(
    `SELECT tr.object_id, t.name, t.slug, tt.taxonomy
     FROM wp_term_relationships tr
     JOIN wp_term_taxonomy tt ON tr.term_taxonomy_id = tt.term_taxonomy_id
     JOIN wp_terms t ON tt.term_id = t.term_id
     WHERE tr.object_id IN (${postIds.join(',')})`
  )

  // ── Pull attachment file paths ─────────────────────────────────────────────
  const [attachments] = await db.execute<any[]>(
    `SELECT post_id, meta_value as file_path
     FROM wp_postmeta
     WHERE meta_key = '_wp_attached_file'
     AND post_id IN (
       SELECT ID FROM wp_posts WHERE post_parent IN (${postIds.join(',')}) AND post_type = 'attachment'
       UNION
       SELECT ID FROM wp_posts WHERE post_type = 'attachment'
     )`
  )

  // Index for fast lookup
  const metaByPost = new Map<number, Record<string, string>>()
  for (const m of allMeta) {
    if (!metaByPost.has(m.post_id)) metaByPost.set(m.post_id, {})
    metaByPost.get(m.post_id)![m.meta_key] = m.meta_value
  }

  const termsByPost = new Map<number, any[]>()
  for (const t of allTerms) {
    if (!termsByPost.has(t.object_id)) termsByPost.set(t.object_id, [])
    termsByPost.get(t.object_id)!.push(t)
  }

  // Attachment ID → file path map
  const attFileMap = new Map<number, string>()
  for (const a of attachments) attFileMap.set(a.post_id, a.file_path)

  // ── Start Payload ──────────────────────────────────────────────────────────
  console.log('🚀 Starting Payload...')
  const payload = await getPayload({ config: payloadConfig })

  // ── Make map (name → Payload ID) ──────────────────────────────────────────
  const makeCache = new Map<string, string>()

  async function getOrCreateMake(name: string): Promise<string | null> {
    if (!name) return null
    const normalized = name.trim()
    if (makeCache.has(normalized)) return makeCache.get(normalized)!

    const { docs } = await payload.find({
      collection: 'makes',
      where: { name: { like: normalized } },
      limit: 1,
    })

    if (docs.length > 0) {
      makeCache.set(normalized, String(docs[0].id))
      return String(docs[0].id)
    }

    const created = await payload.create({
      collection: 'makes',
      data: { name: normalized, slug: slugify(normalized) },
    })
    makeCache.set(normalized, String(created.id))
    return String(created.id)
  }

  const modelCache = new Map<string, string>()

  async function getOrCreateModel(name: string, makeId: string): Promise<string | null> {
    if (!name) return null
    const key = `${makeId}__${name}`
    if (modelCache.has(key)) return modelCache.get(key)!

    const { docs } = await payload.find({
      collection: 'models',
      where: { and: [{ name: { like: name } }, { make: { equals: makeId } }] },
      limit: 1,
    })

    if (docs.length > 0) {
      modelCache.set(key, String(docs[0].id))
      return String(docs[0].id)
    }

    const created = await payload.create({
      collection: 'models',
      data: { name: name.trim(), make: makeId, slug: slugify(name) },
    })
    modelCache.set(key, String(created.id))
    return String(created.id)
  }

  // ── Upload image to Payload ────────────────────────────────────────────────
  async function uploadImage(wpPath: string): Promise<string | null> {
    const url = `${WP_UPLOAD_BASE}/${wpPath}`
    const filename = path.basename(wpPath)
    const localPath = path.join(IMAGE_DIR, filename)

    if (!fs.existsSync(localPath)) {
      try {
        await downloadFile(url, localPath)
      } catch (e: any) {
        report.image_errors.push({ url, error: e.message })
        return null
      }
    }

    try {
      const stats = fs.statSync(localPath)
      const mimetype = filename.match(/\.png$/i)
        ? 'image/png'
        : filename.match(/\.webp$/i)
        ? 'image/webp'
        : 'image/jpeg'

      const created = await payload.create({
        collection: 'media',
        data: { alt: filename.replace(/[-_]/g, ' ').replace(/\.[^.]+$/, '') },
        file: {
          data: fs.readFileSync(localPath),
          tempFilePath: localPath,
          mimetype,
          name: filename,
          size: stats.size,
        },
      })
      return String(created.id)
    } catch (e: any) {
      report.image_errors.push({ file: localPath, error: e.message })
      return null
    }
  }

  // ── Process each listing ──────────────────────────────────────────────────
  for (const post of posts) {
    const meta = metaByPost.get(post.ID) || {}
    const terms = termsByPost.get(post.ID) || []

    const getTerm = (taxonomy: string) =>
      terms.find(t => t.taxonomy === taxonomy)?.slug || ''

    const title = post.post_title || 'Untitled'
    console.log(`\n  Processing: [${post.ID}] ${title}`)

    try {
      // Check if already imported
      const { docs: existing } = await payload.find({
        collection: 'boats',
        where: { stock_number: { equals: String(post.ID) } },
        limit: 1,
      })

      if (existing.length > 0) {
        console.log(`    ⏭  Skipped (already exists)`)
        report.skipped.push({ id: post.ID, title })
        continue
      }

      // Make / Model
      const makeName = terms.find(t => t.taxonomy === 'make')?.name || ''
      const modelName = terms.find(t => t.taxonomy === 'serie')?.name || ''
      const makeId = await getOrCreateMake(makeName)
      const modelId = makeId ? await getOrCreateModel(modelName, makeId) : null

      // Main image
      let mainImageId: string | null = null
      const thumbnailAttId = meta['_thumbnail_id']
      if (thumbnailAttId) {
        const filePath = attFileMap.get(Number(thumbnailAttId))
        if (filePath) mainImageId = await uploadImage(filePath)
      }

      // Gallery
      const galleryIds: string[] = []
      try {
        const rawGallery = meta['gallery']
        if (rawGallery) {
          // PHP serialized array: a:20:{i:1;s:4:"4415"; ...}
          const matches = rawGallery.matchAll(/i:\d+;s:\d+:"(\d+)"/g)
          for (const m of matches) {
            const attId = Number(m[1])
            const filePath = attFileMap.get(attId)
            if (filePath) {
              const imgId = await uploadImage(filePath)
              if (imgId) galleryIds.push(imgId)
            }
          }
        }
      } catch { /* skip gallery errors */ }

      // Price
      const price = Number(meta['price'] || meta['stm_genuine_price'] || 0)
      const salePrice = meta['sale_price'] ? Number(meta['sale_price']) : undefined

      // Status
      const isSold = meta['car_mark_as_sold'] === '1'
      const status = isSold ? 'sold' : 'available'

      // Condition
      const conditionTerm = getTerm('condition')
      const condition = conditionTerm === 'used' ? 'used' : 'new'

      // Field mappings
      const boatType = BOAT_TYPE_MAP[getTerm('boat-type')] || 'power_boat'
      const fuelType = FUEL_MAP[getTerm('fuel')] || 'petrol'
      const driveType = DRIVE_MAP[getTerm('drive-type') || getTerm('drivetype')] || 'outboard'
      const hullMaterial = HULL_MAP[getTerm('hulltype')] || 'grp'
      // WP stores ce-category as lowercase slug (c, b, etc) — map to uppercase
      const ceCategoryRaw = meta['ce-category'] || getTerm('ce-category')
      const ceCategory = ceCategoryRaw ? ceCategoryRaw.toUpperCase() : undefined

      // If no main image, use first gallery image instead
      const effectiveMainImageId = mainImageId || galleryIds[0] || null
      const effectiveGalleryIds = mainImageId ? galleryIds : galleryIds.slice(1)

      const boatData: any = {
        slug: slugify(title) + '-' + post.ID,
        status,
        condition,
        price,
        currency: 'EUR',
        iva_included: getTerm('iva-paid') === 'iva-paid',
        ...(salePrice && { sale_price: salePrice }),
        ...(makeId && { make: makeId }),
        ...(modelId && { model: modelId }),
        ...(meta['ca-year'] && { year: Number(meta['ca-year']) }),
        ...(meta['length_range'] && { length_m: parseFloat(meta['length_range']) }),
        ...(meta['beamwidth'] && { beam_m: parseFloat(meta['beamwidth']) }),
        ...(meta['engine-hour'] && { engine_hours: Number(meta['engine-hour']) }),
        stock_number: String(post.ID),
        boat_type: boatType,
        fuel_type: fuelType,
        drive_type: driveType,
        hull_material: hullMaterial,
        ...(ceCategory && ['A','B','C','D'].includes(ceCategory) && { ce_category: ceCategory }),
        location: meta['stm_car_location'] || 'Lagos, Portugal',
        ...(meta['stm_lat_car_admin'] && { latitude: parseFloat(meta['stm_lat_car_admin']) }),
        ...(meta['stm_lng_car_admin'] && { longitude: parseFloat(meta['stm_lng_car_admin']) }),
        ...(effectiveMainImageId && { main_image: effectiveMainImageId }),
        ...(effectiveGalleryIds.length > 0 && { gallery: effectiveGalleryIds.map(id => ({ image: id })) }),
        ...(meta['video_preview'] && { video_url: meta['video_preview'] }),
      }

      // Create with EN locale first, then update PT
      const created = await payload.create({
        collection: 'boats',
        data: { ...boatData, title },
        locale: 'en',
      })
      await payload.update({
        collection: 'boats',
        id: created.id,
        data: { title },
        locale: 'pt',
      })

      console.log(`    ✅ Imported: ${title}`)
      report.succeeded.push({ id: post.ID, title, makeId, modelId, images: effectiveGalleryIds.length + (effectiveMainImageId ? 1 : 0) })
    } catch (err: any) {
      console.error(`    ❌ Failed: ${title} — ${err.message}`)
      report.failed.push({ id: post.ID, title, error: err.message })
    }
  }

  await db.end()
  server.close()

  // Write report
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2))

  console.log('\n─────────────────────────────────')
  console.log(`✅ Succeeded:    ${report.succeeded.length}`)
  console.log(`⏭  Skipped:      ${report.skipped.length}`)
  console.log(`❌ Failed:       ${report.failed.length}`)
  console.log(`🖼  Image errors: ${report.image_errors.length}`)
  console.log(`\nFull report: ${REPORT_PATH}`)

  process.exit(0)
}

run().catch(err => {
  console.error('Fatal:', err)
  process.exit(1)
})
