/**
 * Pre-fill the Promo Banner global with the Black Friday "coming soon" copy,
 * switched OFF. Turn it on in the admin: Settings > Promo Banner > "Show banner".
 * Never overwrites a banner that already has text.
 *
 * Run: npx tsx --env-file=.env.local scripts/seed-promo-banner.ts
 */
import { getPayload } from 'payload'
import config from '@payload-config'

;(async () => {
  const payload = await getPayload({ config })

  const existing = (await payload.findGlobal({ slug: 'promo-banner', locale: 'en' })) as any
  if (existing?.message) {
    console.log(`Promo banner already has text ("${existing.message}", enabled=${existing.enabled}) — leaving it alone.`)
    process.exit(0)
  }

  await payload.updateGlobal({
    slug: 'promo-banner',
    locale: 'en',
    data: { enabled: false, message: 'Black Friday Deals — coming soon' },
  })
  await payload.updateGlobal({
    slug: 'promo-banner',
    locale: 'pt',
    data: { message: 'Ofertas Black Friday — em breve' },
  })

  const check = (await payload.findGlobal({ slug: 'promo-banner', locale: 'en' })) as any
  console.log(`Seeded: "${check.message}" — enabled=${check.enabled}`)
  process.exit(0)
})().catch(e => { console.error(e); process.exit(1) })
