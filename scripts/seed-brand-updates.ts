/**
 * Refresh/add a News & Updates story per brand (GRAND, Yamarin, SPX RIB,
 * Vanclaes, MasterCraft), each backed by a real photo of stock we own.
 *
 * Run: npx tsx --env-file=.env.local scripts/seed-brand-updates.ts
 */
import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'
import config from '@payload-config'

const MEDIA_DIR = path.join(process.cwd(), 'public', 'media')

async function uploadMedia(payload: any, filename: string, alt: string) {
  const localPath = path.join(MEDIA_DIR, filename)
  const stats = fs.statSync(localPath)
  const mimetype = filename.match(/\.png$/i)
    ? 'image/png'
    : filename.match(/\.webp$/i)
    ? 'image/webp'
    : 'image/jpeg'
  const created = await payload.create({
    collection: 'media',
    data: { alt },
    file: {
      data: fs.readFileSync(localPath),
      mimetype,
      name: filename,
      size: stats.size,
    },
  })
  return created.id
}

async function upsertUpdate(payload: any, opts: {
  slug: string
  daysAgo: number
  link?: string
  imageId?: string | number
  en: { title: string; summary: string }
  pt: { title: string; summary: string }
}) {
  const publishDate = new Date()
  publishDate.setDate(publishDate.getDate() - opts.daysAgo)

  const existing = await payload.find({
    collection: 'updates',
    where: { slug: { equals: opts.slug } },
    limit: 1,
  })

  const baseData: any = {
    title: opts.en.title,
    summary: opts.en.summary,
    link: opts.link,
    publish_date: publishDate.toISOString(),
    published: true,
  }
  if (opts.imageId) baseData.image = opts.imageId

  let id: string
  if (existing.docs.length > 0) {
    id = existing.docs[0].id
    await payload.update({ collection: 'updates', id, locale: 'en', data: baseData })
    console.log(`updated (en): ${opts.slug}`)
  } else {
    const doc = await payload.create({
      collection: 'updates',
      locale: 'en',
      data: { slug: opts.slug, ...baseData },
    })
    id = doc.id
    console.log(`created (en): ${opts.slug}`)
  }

  await payload.update({
    collection: 'updates',
    id,
    locale: 'pt',
    data: { title: opts.pt.title, summary: opts.pt.summary },
  })
  console.log(`updated (pt): ${opts.slug}`)
}

async function main() {
  const payload = await getPayload({ config })

  console.log('Uploading images...')
  const grandImg = await uploadMedia(payload, 'grand-tile-1.jpg', 'GRAND Golden Line 680 underway off the Algarve coast')
  const yamarinImg = await uploadMedia(payload, 'wp7150-Yamarin-63BR-16-June-Drone-22-scaled.jpg', 'Yamarin 63 BR anchored in clear Algarve water, drone view')
  const spxImg = await uploadMedia(payload, 'wp5100-20250515_173852-1-scaled-e1752763034708.jpg', 'SPX RIB 24 Dinette on its trailer at Marina de Lagos')
  const mastercraftImg = await uploadMedia(payload, 'mastercraft-x-hero.webp', 'MasterCraft X Family towboat underway at sunset')
  console.log('Images uploaded.')

  // Vanclaes already has a real, already-uploaded Payload media doc — reuse it.
  const vanclaesImg = '6a6897e88d4163af065e09ef'

  await upsertUpdate(payload, {
    slug: 'grand-golden-line-680-arrival',
    daysAgo: 2,
    link: '/boats/grand-golden-line-680-2026-2',
    imageId: grandImg,
    en: {
      title: 'GRAND Golden Line 680 now available for sea trials',
      summary: 'Our new GRAND Golden Line 680 is in the water at Marina de Lagos — book a viewing or sea trial this week.',
    },
    pt: {
      title: 'GRAND Golden Line 680 já disponível para ensaios no mar',
      summary: 'O nosso novo GRAND Golden Line 680 está já na água na Marina de Lagos — marque uma visita ou ensaio no mar esta semana.',
    },
  })

  await upsertUpdate(payload, {
    slug: 'yamarin-63-br-in-stock',
    daysAgo: 5,
    link: '/boats/yamarin-63-br-2026',
    imageId: yamarinImg,
    en: {
      title: 'New Yamarin 63 BR ready for the 2026 season',
      summary: 'Finnish-built and Algarve-ready: our latest Yamarin 63 BR is in stock, fully warrantied and available now.',
    },
    pt: {
      title: 'Novo Yamarin 63 BR pronto para a época de 2026',
      summary: 'Construído na Finlândia e pronto para o Algarve: o nosso mais recente Yamarin 63 BR está em stock, com garantia completa e disponível já.',
    },
  })

  await upsertUpdate(payload, {
    slug: 'spx-rib-24-dinette-in-stock',
    daysAgo: 8,
    link: '/boats/spx-rib-24-dinette-2023',
    imageId: spxImg,
    en: {
      title: 'SPX RIB 24 Dinette arrives in Lagos',
      summary: 'Sicilian design meets serious performance — our SPX RIB 24 Dinette is ready for viewing at Marina de Lagos.',
    },
    pt: {
      title: 'SPX RIB 24 Dinette chega a Lagos',
      summary: 'O design siciliano encontra o desempenho a sério — o nosso SPX RIB 24 Dinette está pronto para visita na Marina de Lagos.',
    },
  })

  await upsertUpdate(payload, {
    slug: 'vanclaes-trailers-in-stock',
    daysAgo: 12,
    link: '/trailers/vanclaesrmw2750',
    imageId: vanclaesImg,
    en: {
      title: 'New Vanclaes stainless-steel trailers in stock',
      summary: 'A fresh batch of Vanclaes RMW trailers has landed, sized and ready for boats across our range.',
    },
    pt: {
      title: 'Novos atrelados Vanclaes em aço inoxidável em stock',
      summary: 'Chegou um novo lote de atrelados Vanclaes RMW, dimensionados e prontos para barcos de toda a nossa gama.',
    },
  })

  await upsertUpdate(payload, {
    slug: 'mastercraft-authorised-dealer',
    daysAgo: 1,
    link: '/brands/mastercraft',
    imageId: mastercraftImg,
    en: {
      title: 'Algarve Boat Sales is now an authorised MasterCraft dealer',
      summary: "We're proud to bring MasterCraft's X, XT and NXT families to the Algarve — enquire to be among the first.",
    },
    pt: {
      title: 'A Algarve Boat Sales é agora concessionário autorizado MasterCraft',
      summary: 'Orgulhamo-nos de trazer as famílias X, XT e NXT da MasterCraft ao Algarve — contacte-nos para ser dos primeiros.',
    },
  })

  console.log('\nDone.')
  process.exit(0)
}

main().catch(e => { console.error(e); process.exit(1) })
