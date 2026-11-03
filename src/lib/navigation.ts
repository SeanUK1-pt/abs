import { getPayload } from 'payload'
import config from '@payload-config'
import type { Locale } from './locale'

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

export interface PromoBannerData {
  message: string
  linkLabel: string | null
  linkUrl: string | null
}

// Returns the banner to show right now, or null. It must be switched on and,
// if a start/end date is set, the current time must fall inside that window.
export async function getPromoBanner(locale: Locale): Promise<PromoBannerData | null> {
  try {
    const payload = await getPayload({ config })
    const b = (await payload.findGlobal({ slug: 'promo-banner', locale })) as any
    if (!b?.enabled || !b.message?.trim()) return null

    const now = Date.now()
    if (b.show_from && new Date(b.show_from).getTime() > now) return null
    if (b.show_until && new Date(b.show_until).getTime() < now) return null

    // Only site-relative paths or http(s) addresses are accepted as links.
    const url = typeof b.link_url === 'string' ? b.link_url.trim() : ''
    const linkOk = /^\/(?!\/)/.test(url) || /^https?:\/\//i.test(url)
    const label = typeof b.link_label === 'string' ? b.link_label.trim() : ''

    return {
      message: b.message.trim(),
      linkLabel: linkOk && label ? label : null,
      linkUrl: linkOk && label ? url : null,
    }
  } catch {
    return null
  }
}
