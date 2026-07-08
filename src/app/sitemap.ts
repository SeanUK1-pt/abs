import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'

const BASE = 'https://www.algarveboatsales.com'

const STATIC_PAGES: MetadataRoute.Sitemap = [
  { url: BASE,                              changeFrequency: 'weekly',  priority: 1.0 },
  { url: `${BASE}/boats`,                   changeFrequency: 'daily',   priority: 0.9 },
  { url: `${BASE}/brands`,                  changeFrequency: 'monthly', priority: 0.8 },
  { url: `${BASE}/trailers`,                changeFrequency: 'weekly',  priority: 0.8 },
  { url: `${BASE}/trailers/configurator`,   changeFrequency: 'monthly', priority: 0.6 },
  { url: `${BASE}/services`,                changeFrequency: 'monthly', priority: 0.7 },
  { url: `${BASE}/about`,                   changeFrequency: 'monthly', priority: 0.6 },
  { url: `${BASE}/contact`,                 changeFrequency: 'monthly', priority: 0.7 },
  { url: `${BASE}/sell-your-boat`,          changeFrequency: 'monthly', priority: 0.7 },
  { url: `${BASE}/maintenance`,             changeFrequency: 'monthly', priority: 0.6 },
  { url: `${BASE}/boat-storage`,            changeFrequency: 'monthly', priority: 0.6 },
  { url: `${BASE}/terms-and-conditions`,    changeFrequency: 'yearly',  priority: 0.2 },
  { url: `${BASE}/privacy-policy`,          changeFrequency: 'yearly',  priority: 0.2 },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config })

  const [boatsRes, trailersRes] = await Promise.all([
    payload.find({
      collection: 'boats',
      limit: 500,
      depth: 0,
      pagination: false,
    }),
    payload.find({
      collection: 'trailers',
      limit: 200,
      depth: 0,
      pagination: false,
    }),
  ])

  const boatPages: MetadataRoute.Sitemap = boatsRes.docs.map((boat: any) => ({
    url: `${BASE}/boats/${boat.slug}`,
    lastModified: boat.updatedAt ? new Date(boat.updatedAt) : undefined,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const trailerPages: MetadataRoute.Sitemap = trailersRes.docs
    .filter((t: any) => t.slug)
    .map((trailer: any) => ({
      url: `${BASE}/trailers/${trailer.slug}`,
      lastModified: trailer.updatedAt ? new Date(trailer.updatedAt) : undefined,
      changeFrequency: 'weekly',
      priority: 0.6,
    }))

  return [...STATIC_PAGES, ...boatPages, ...trailerPages]
}
