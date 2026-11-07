import { cache } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Locale } from './locale'
import { isLive, cleanLink } from './promoLogic'
import { getTranslations } from './translations'

export async function getMainNav(locale: Locale) {
  try {
    const payload = await getPayload({ config })
    const nav = await payload.findGlobal({ slug: 'main-navigation', locale })
    return (nav as any).items || []
  } catch {
    return []
  }
}

export async function getFooterNav(locale: Locale) {
  try {
    const payload = await getPayload({ config })
    const nav = await payload.findGlobal({ slug: 'footer-navigation', locale })
    return (nav as any).items || []
  } catch {
    return []
  }
}

export async function getSiteSettings() {
  try {
    const payload = await getPayload({ config })
    return await payload.findGlobal({ slug: 'site-settings' }) as any
  } catch {
    return null
  }
}

// ── Promotion (top bar + homepage panel) ─────────────────────────────────

// One read per request, shared by the layout (bar) and the homepage (panel).
const loadPromo = cache(async (locale: Locale): Promise<any | null> => {
  try {
    const payload = await getPayload({ config })
    return await payload.findGlobal({ slug: 'promo-banner', locale, depth: 2 })
  } catch {
    return null
  }
})

export interface PromoBannerData {
  message: string
  linkLabel: string | null
  linkUrl: string | null
}

// preview = an admin previewing: show the saved content even if the master
// switch is off or outside its dates.
export async function getPromoBanner(locale: Locale, preview = false): Promise<PromoBannerData | null> {
  const p = await loadPromo(locale)
  if (!p || p.show_bar === false) return null
  if (!preview && !isLive(p)) return null
  const message = typeof p.message === 'string' ? p.message.trim() : ''
  if (!message) return null
  const link = cleanLink(p.link_url, p.link_label)
  return { message, linkLabel: link?.label ?? null, linkUrl: link?.url ?? null }
}

export interface PromoPanelData {
  placement: 'replace_hero' | 'below_hero'
  badge: string | null
  headline: string | null
  text: string | null
  image: { url: string; alt: string } | null
  cta: { label: string; url: string } | null
  boats: { boat: any; note: string | null }[]
}

export async function getPromoPanel(locale: Locale, preview = false): Promise<PromoPanelData | null> {
  const p = await loadPromo(locale)
  if (!p?.show_panel) return null
  if (!preview && !isLive(p)) return null

  const str = (v: unknown) => (typeof v === 'string' && v.trim() ? v.trim() : null)
  const headline = str(p.panel_headline)

  // Boats that have sold are skipped; a boat that failed to load is skipped too.
  const boats = (Array.isArray(p.panel_boats) ? p.panel_boats : [])
    .filter((row: any) => row?.boat && typeof row.boat === 'object' && row.boat.status !== 'sold')
    .map((row: any) => ({ boat: row.boat, note: str(row.deal_note) }))

  // Nothing worth showing: let the page keep its normal hero instead.
  if (!headline && boats.length === 0) return null

  const img = p.panel_image && typeof p.panel_image === 'object' ? p.panel_image : null
  return {
    placement: p.panel_placement === 'replace_hero' ? 'replace_hero' : 'below_hero',
    badge: str(p.panel_badge),
    headline,
    text: str(p.panel_text),
    image: img?.url ? { url: img.url, alt: img.alt || '' } : null,
    cta: cleanLink(p.panel_cta_url, p.panel_cta_label),
    boats,
  }
}

// ── Brokerage wording (edited in the admin: Settings > Site Settings) ─────

// If a field is blank, or the settings cannot be read, the standard wording from
// translations is used, so a brokerage boat is never left without its notice.
// fallbackLocale is off so a blank Portuguese field uses the standard
// Portuguese wording rather than the English text from the admin.
export const getBrokerageText = cache(async (locale: Locale): Promise<{ short: string; full: string }> => {
  const t = getTranslations(locale)
  const standard = { short: t('brokerage_card_note'), full: t('brokerage_disclaimer') }
  try {
    const payload = await getPayload({ config })
    const s = (await payload.findGlobal({ slug: 'site-settings', locale, fallbackLocale: false, depth: 0 })) as any
    const clean = (v: unknown) => (typeof v === 'string' ? v.trim() : '')
    return {
      short: clean(s?.brokerage_short_notice) || standard.short,
      full: clean(s?.brokerage_disclaimer) || standard.full,
    }
  } catch {
    return standard
  }
})
