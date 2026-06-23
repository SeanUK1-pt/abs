import { getPayload } from 'payload'
import config from '@payload-config'
import type { Locale } from './locale'

export async function getPageData(slug: string, locale: Locale) {
  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'pages',
      where: { slug: { equals: slug } },
      limit: 1,
      locale,
    })
    const page = docs[0] as any
    if (!page) return null
    return {
      title: page.title || '',
      meta_description: page.meta_description || '',
      content: page.content || null,
    }
  } catch {
    return null
  }
}

// Backwards-compat alias
export const getPageMeta = getPageData
