/**
 * Put the standard brokerage wording into the admin (Settings > Site Settings >
 * Brokerage listings) so it can be edited there. Never overwrites a field that
 * already has text.
 *
 * Run: npx tsx --env-file=.env.local scripts/seed-brokerage-wording.ts
 */
import { getPayload } from 'payload'
import config from '@payload-config'
import { getTranslations } from '../src/lib/translations'

;(async () => {
  const payload = await getPayload({ config })
  for (const locale of ['en', 'pt'] as const) {
    const t = getTranslations(locale)
    const cur = (await payload.findGlobal({ slug: 'site-settings', locale, fallbackLocale: false, depth: 0 })) as any
    const data: Record<string, string> = {}
    if (!cur?.brokerage_short_notice) data.brokerage_short_notice = t('brokerage_card_note')
    if (!cur?.brokerage_disclaimer) data.brokerage_disclaimer = t('brokerage_disclaimer')
    if (Object.keys(data).length) {
      await payload.updateGlobal({ slug: 'site-settings', locale, data })
      console.log(`${locale}: wrote ${Object.keys(data).join(', ')}`)
    } else {
      console.log(`${locale}: already filled in - left alone`)
    }
  }
  const out = (l: 'en' | 'pt') => payload.findGlobal({ slug: 'site-settings', locale: l, fallbackLocale: false, depth: 0 }) as Promise<any>
  for (const l of ['en', 'pt'] as const) { const g = await out(l); console.log(`${l}: short="${g.brokerage_short_notice}" | full starts "${String(g.brokerage_disclaimer).slice(0, 60)}…" (${String(g.brokerage_disclaimer).length} chars)`) }
  process.exit(0)
})().catch(e => { console.error(e); process.exit(1) })
