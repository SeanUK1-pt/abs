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
