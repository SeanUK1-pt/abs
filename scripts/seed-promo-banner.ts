/**
 * Pre-fill the Promotion setting with the Black Friday "coming soon" copy.
 * Everything is left OFF: nothing is public until "Show promotion" is ticked in
 * the admin (Settings > Promotion). Never overwrites text that already exists.
 *
 * Run: npx tsx --env-file=.env.local scripts/seed-promo-banner.ts
 */
import { getPayload } from 'payload'
import config from '@payload-config'

;(async () => {
  const payload = await getPayload({ config })
  const read = async (locale: 'en' | 'pt') => (await payload.findGlobal({ slug: 'promo-banner', locale })) as any
  const en = await read('en')

  // Top bar copy
  if (!en?.message) {
    await payload.updateGlobal({ slug: 'promo-banner', locale: 'en', data: { enabled: false, message: 'Black Friday Deals — coming soon' } })
    await payload.updateGlobal({ slug: 'promo-banner', locale: 'pt', data: { message: 'Ofertas Black Friday — em breve' } })
    console.log('Seeded top bar copy.')
  }

  // Homepage panel copy (panel itself stays unticked)
  if (!en?.panel_headline) {
    await payload.updateGlobal({
      slug: 'promo-banner',
      locale: 'en',
      data: {
        show_panel: false,
        panel_placement: 'below_hero',
        panel_badge: 'Black Friday',
        panel_headline: 'Black Friday Deals',
        panel_text: 'Special prices on selected boats — coming soon.',
      },
    })
    await payload.updateGlobal({
      slug: 'promo-banner',
      locale: 'pt',
      data: {
        panel_badge: 'Black Friday',
        panel_headline: 'Ofertas Black Friday',
        panel_text: 'Preços especiais em barcos selecionados — em breve.',
      },
    })
    console.log('Seeded homepage panel copy.')
  }

  const out = await read('en')
  console.log(`State: enabled=${out.enabled} show_bar=${out.show_bar} show_panel=${out.show_panel} placement=${out.panel_placement} headline="${out.panel_headline}"`)
  process.exit(0)
})().catch(e => { console.error(e); process.exit(1) })
