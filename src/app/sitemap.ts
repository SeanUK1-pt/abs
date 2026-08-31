import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'

const BASE = 'https://www.algarveboatsales.com'

type Freq = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'

interface StaticEntry {
  path: string
  changeFrequency: Freq
  priority: number
  /** Slug in the CMS `pages` collection this route is backed by, if any —
   *  used to pull a real lastModified date. Routes with no CMS-backed
   *  content (home, boats listing, trailers listing/configurator) are left
   *  undefined and get no lastModified, since we have no accurate signal
   *  for them and a fabricated date would be actively misleading. */
  pageSlug?: string
}

const STATIC_ENTRIES: StaticEntry[] = [
  { path: '',                     changeFrequency: 'weekly',  priority: 1.0 },
  { path: '/boats',               changeFrequency: 'daily',   priority: 0.9 },
  { path: '/brands',              changeFrequency: 'monthly', priority: 0.8, pageSlug: 'brands' },
  { path: '/brands/mastercraft',  changeFrequency: 'monthly', priority: 0.7 },
  { path: '/trailers',            changeFrequency: 'weekly',  priority: 0.8 },
  { path: '/trailers/configurator', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/services',            changeFrequency: 'monthly', priority: 0.7, pageSlug: 'services' },
  { path: '/about',               changeFrequency: 'monthly', priority: 0.6, pageSlug: 'about' },
  { path: '/contact',             changeFrequency: 'monthly', priority: 0.7, pageSlug: 'contact' },
  { path: '/sell-your-boat',      changeFrequency: 'monthly', priority: 0.7, pageSlug: 'sell-your-boat' },
  { path: '/maintenance',         changeFrequency: 'monthly', priority: 0.6, pageSlug: 'maintenance' },
  { path: '/boat-storage',        changeFrequency: 'monthly', priority: 0.6, pageSlug: 'boat-storage' },
  { path: '/terms-and-conditions', changeFrequency: 'yearly', priority: 0.2, pageSlug: 'terms-and-conditions' },
  { path: '/privacy-policy',      changeFrequency: 'yearly',  priority: 0.2, pageSlug: 'privacy-policy' },
]

function makeEntries(
  path: string,
  changeFrequency: Freq,
  priority: number,
  lastModified?: Date,
): MetadataRoute.Sitemap {
  const enUrl = `${BASE}${path || '/'}`
  const ptUrl = `${BASE}/pt${path || ''}`
  const alternates = {
    languages: {
      'en': enUrl,
      'pt': ptUrl,
      'x-default': enUrl,
    },
  }
  return [
    { url: enUrl, changeFrequency, priority, alternates, ...(lastModified ? { lastModified } : {}) },
    { url: ptUrl, changeFrequency, priority, alternates, ...(lastModified ? { lastModified } : {}) },
  ]
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config })

  const [boatsRes, trailersRes, pagesRes] = await Promise.all([
    payload.find({ collection: 'boats',   limit: 500, depth: 0, pagination: false }),
    payload.find({ collection: 'trailers', limit: 200, depth: 0, pagination: false }),
    payload.find({ collection: 'pages',   limit: 100, depth: 0, pagination: false }),
  ])

  const pageUpdatedAt = new Map<string, string>(
    pagesRes.docs.map((p: any) => [p.slug, p.updatedAt])
  )

  const staticEntries = STATIC_ENTRIES.flatMap(({ path, changeFrequency, priority, pageSlug }) => {
    const updatedAt = pageSlug ? pageUpdatedAt.get(pageSlug) : undefined
    return makeEntries(path, changeFrequency, priority, updatedAt ? new Date(updatedAt) : undefined)
  })

  const boatEntries = boatsRes.docs.flatMap((boat: any) =>
    makeEntries(
      `/boats/${boat.slug}`,
      'weekly',
      0.8,
      boat.updatedAt ? new Date(boat.updatedAt) : undefined,
    )
  )

  const trailerEntries = trailersRes.docs
    .filter((t: any) => t.slug)
    .flatMap((trailer: any) =>
      makeEntries(
        `/trailers/${trailer.slug}`,
        'weekly',
        0.6,
        trailer.updatedAt ? new Date(trailer.updatedAt) : undefined,
      )
    )

  return [...staticEntries, ...boatEntries, ...trailerEntries]
}
