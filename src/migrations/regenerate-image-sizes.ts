/**
 * Regenerates thumbnail/card/hero image sizes for all media documents that
 * were imported directly into MongoDB (bypassing Payload's upload pipeline).
 *
 * Usage:
 *   npx tsx src/migrations/regenerate-image-sizes.ts
 *
 * Prerequisites:
 *   - MongoDB running locally
 *   - Payload dev server NOT running (this script starts its own connection)
 *   - public/media/ directory present with original image files
 */

import * as fs from 'fs'
import * as path from 'path'
import { getPayload } from 'payload'
import payloadConfig from '../payload.config'

const MEDIA_DIR = path.resolve(process.cwd(), 'public/media')

const MIME_MAP: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
}

async function run() {
  const payload = await getPayload({ config: payloadConfig })

  // Fetch all media docs in batches
  let page = 1
  const pageSize = 50
  let totalProcessed = 0
  let totalSkipped = 0
  let totalErrors = 0

  console.log('Fetching media documents...')

  while (true) {
    const { docs, totalDocs, hasNextPage } = await payload.find({
      collection: 'media',
      limit: pageSize,
      page,
      depth: 0,
    })

    if (docs.length === 0) break

    console.log(`\nPage ${page}: processing ${docs.length} of ${totalDocs} documents`)

    for (const doc of docs) {
      const filename = doc.filename as string | undefined
      if (!filename) {
        console.log(`  [skip] id=${doc.id} — no filename`)
        totalSkipped++
        continue
      }

      // Skip non-image files (PDFs etc.)
      const ext = path.extname(filename).toLowerCase()
      const mimetype = MIME_MAP[ext]
      if (!mimetype) {
        console.log(`  [skip] ${filename} — not an image`)
        totalSkipped++
        continue
      }

      // Check if sizes already populated (skip if all three exist)
      const sizes = (doc as any).sizes
      if (sizes?.thumbnail?.url && sizes?.card?.url && sizes?.hero?.url) {
        console.log(`  [skip] ${filename} — sizes already present`)
        totalSkipped++
        continue
      }

      // Read file from disk
      const filePath = path.join(MEDIA_DIR, filename)
      if (!fs.existsSync(filePath)) {
        console.log(`  [miss] ${filename} — file not found on disk`)
        totalErrors++
        continue
      }

      try {
        const data = fs.readFileSync(filePath)
        const stats = fs.statSync(filePath)

        await payload.update({
          collection: 'media',
          id: doc.id,
          data: {},
          file: {
            name: filename,
            data,
            mimetype,
            size: stats.size,
          },
        })

        console.log(`  [ok]   ${filename}`)
        totalProcessed++
      } catch (err: any) {
        console.error(`  [err]  ${filename} — ${err.message}`)
        totalErrors++
      }
    }

    if (!hasNextPage) break
    page++
  }

  console.log(`\n─────────────────────────────────`)
  console.log(`Done.`)
  console.log(`  Processed : ${totalProcessed}`)
  console.log(`  Skipped   : ${totalSkipped}`)
  console.log(`  Errors    : ${totalErrors}`)

  process.exit(0)
}

run().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
