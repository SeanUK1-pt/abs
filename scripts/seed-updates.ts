/**
 * Seed sample News & Updates items.
 *
 * Usage:
 *   npx tsx scripts/seed-updates.ts
 *
 * Prerequisites:
 *   - DATABASE_URI and PAYLOAD_SECRET set in the environment (.env)
 *   - MongoDB reachable
 *
 * Idempotent: skips items whose slug already exists.
 */

import { getPayload } from 'payload'
import config from '../src/payload.config'

type Seed = {
  slug: string
  daysAgo: number
  link?: string
  en: { title: string; summary: string }
  pt: { title: string; summary: string }
}

const ITEMS: Seed[] = [
  {
    slug: 'grand-golden-line-680-arrival',
    daysAgo: 2,
    link: '/boats',
    en: {
      title: 'New 2026 GRAND Golden Line 680 has arrived',
      summary:
        'The latest Golden Line 680 RIB has landed at our Lagos marina office — book a viewing this week.',
    },
    pt: {
      title: 'Novo GRAND Golden Line 680 de 2026 chegou',
      summary:
        'O mais recente RIB Golden Line 680 chegou ao nosso escritório na marina de Lagos — marque uma visita esta semana.',
    },
  },
  {
    slug: 'yamarin-63-br-in-stock',
    daysAgo: 9,
    link: '/boats',
    en: {
      title: 'Yamarin 63 BR now in stock',
      summary:
        'A brand-new Yamarin 63 BR is ready for the Algarve season. Petrol outboard, full warranty.',
    },
    pt: {
      title: 'Yamarin 63 BR já disponível',
      summary:
        'Um Yamarin 63 BR novo está pronto para a época algarvia. Motor a gasolina fora de borda, garantia completa.',
    },
  },
  {
    slug: 'winter-indoor-storage-2026',
    daysAgo: 18,
    link: '/services',
    en: {
      title: 'Winter indoor storage now booking',
      summary:
        'Protect your boat over winter with secure indoor storage and full servicing at our Lagos facility.',
    },
    pt: {
      title: 'Armazenamento interior de inverno já disponível',
      summary:
        'Proteja o seu barco durante o inverno com armazenamento interior seguro e manutenção completa em Lagos.',
    },
  },
]

async function main() {
  const payload = await getPayload({ config })
  let created = 0
  let skipped = 0

  for (const item of ITEMS) {
    const existing = await payload.find({
      collection: 'updates',
      where: { slug: { equals: item.slug } },
      limit: 1,
    })
    if (existing.docs.length > 0) {
      skipped++
      console.log(`skip (exists): ${item.slug}`)
      continue
    }

    const publishDate = new Date()
    publishDate.setDate(publishDate.getDate() - item.daysAgo)

    const doc = await payload.create({
      collection: 'updates',
      locale: 'en',
      data: {
        slug: item.slug,
        title: item.en.title,
        summary: item.en.summary,
        link: item.link,
        publish_date: publishDate.toISOString(),
        published: true,
      } as any,
    })

    // Add the Portuguese translation.
    await payload.update({
      collection: 'updates',
      id: doc.id,
      locale: 'pt',
      data: { title: item.pt.title, summary: item.pt.summary } as any,
    })

    created++
    console.log(`created: ${item.slug}`)
  }

  console.log(`\nDone. created=${created} skipped=${skipped}`)
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
