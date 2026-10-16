import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import { BoatCard } from '@/components/boats/BoatCard'
import { FilterSidebar } from '@/components/boats/FilterSidebar'
import { SortBar } from '@/components/boats/SortBar'
import { FavouritesBar } from '@/components/boats/FavouritesBar'
import { getLocaleFromParam } from '@/lib/locale'
import { getTranslations } from '@/lib/translations'
import { localePath, hreflangAlternates } from '@/lib/localePath'
import styles from './boats.module.css'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params
  const locale = getLocaleFromParam(localeParam)
  const t = getTranslations(locale)
  return {
    title: t('meta_boats_title'),
    description: t('meta_boats_description'),
    alternates: {
      canonical: locale === 'pt' ? 'https://www.algarveboatsales.com/pt/boats' : 'https://www.algarveboatsales.com/boats',
      languages: hreflangAlternates('/boats'),
    },
  }
}

interface SearchParams {
  condition?: string
  boat_type?: string
  make?: string
  price_min?: string
  price_max?: string
  length_min?: string
  length_max?: string
  year_min?: string
  year_max?: string
  fuel_type?: string
  drive_type?: string
  hull_material?: string
  sort?: string
  page?: string
  favourites?: string
  poa?: string
}

async function getBoats(searchParams: SearchParams) {
  const payload = await getPayload({ config })
  const locale = (searchParams as any)._locale || 'en'

  // Favourites view: read IDs from cookie, fetch each boat individually
  if (searchParams.favourites === '1') {
    const cookieStore = await cookies()
    const raw = cookieStore.get('abs_favourites')?.value
    let idList: string[] = []
    if (raw) {
      try {
        const parsed = JSON.parse(decodeURIComponent(raw))
        if (Array.isArray(parsed)) idList = parsed
      } catch { /* malformed cookie */ }
    }
    const empty = { docs: [], totalDocs: 0, totalPages: 1, page: 1, pagingCounter: 1, hasPrevPage: false, hasNextPage: false, prevPage: null, nextPage: null, limit: 0 }
    if (idList.length === 0) return empty as any
    const docs = (await Promise.all(
      idList.map(id =>
        payload.findByID({ collection: 'boats', id, depth: 2, locale: locale as any }).catch(() => null)
      )
    )).filter(Boolean)
    return { docs, totalDocs: docs.length, totalPages: 1, page: 1, pagingCounter: 1, hasPrevPage: false, hasNextPage: false, prevPage: null, nextPage: null, limit: docs.length } as any
  }

  const where: Record<string, any> = { status: { not_equals: 'sold' } }

  if (searchParams.condition) where.condition = { equals: searchParams.condition }
  if (searchParams.boat_type) where.boat_type = { equals: searchParams.boat_type }
  if (searchParams.make) where.make = { equals: searchParams.make }
  if (searchParams.fuel_type) where.fuel_type = { equals: searchParams.fuel_type }
  if (searchParams.drive_type) where.drive_type = { equals: searchParams.drive_type }
  if (searchParams.hull_material) where.hull_material = { equals: searchParams.hull_material }

  // Price-on-application boats are included unless poa=0. A price range never
  // matches them by price, so with a range set they are added alongside the
  // priced matches instead (and sorted after them, below).
  const includePoa = searchParams.poa !== '0'
  const hasPriceRange = Boolean(searchParams.price_min || searchParams.price_max)

  if (hasPriceRange) {
    const price: Record<string, number> = { greater_than: 0 }
    if (searchParams.price_min) price.greater_than_equal = Number(searchParams.price_min)
    if (searchParams.price_max) price.less_than_equal = Number(searchParams.price_max)
    const pricedMatch = { and: [{ price: price }, { price_on_application: { not_equals: true } }] }
    if (includePoa) where.or = [pricedMatch, { price_on_application: { equals: true } }]
    else Object.assign(where, pricedMatch)
  } else if (!includePoa) {
    where.price_on_application = { not_equals: true }
  }

  if (searchParams.length_min || searchParams.length_max) {
    where.length_m = {}
    if (searchParams.length_min) where.length_m.greater_than_equal = Number(searchParams.length_min)
    if (searchParams.length_max) where.length_m.less_than_equal = Number(searchParams.length_max)
  }

  if (searchParams.year_min || searchParams.year_max) {
    where.year = {}
    if (searchParams.year_min) where.year.greater_than_equal = Number(searchParams.year_min)
    if (searchParams.year_max) where.year.less_than_equal = Number(searchParams.year_max)
  }

  // Price sorts group by the POA flag first so POA boats always come last.
  const sortMap: Record<string, string | string[]> = {
    price_asc: ['price_on_application', 'price'],
    price_desc: ['price_on_application', '-price'],
    newest: '-createdAt',
    length: 'length_m',
  }
  const chosenSort = sortMap[searchParams.sort || 'newest'] || '-createdAt'
  // With a price range and POA included, keep POA boats after the priced ones.
  const sort = hasPriceRange && includePoa && !Array.isArray(chosenSort)
    ? ['price_on_application', chosenSort]
    : chosenSort

  const currentPage = Number(searchParams.page) || 1

  const result = await payload.find({
    collection: 'boats',
    where,
    sort,
    page: currentPage,
    limit: 12,
    depth: 2,
    locale: locale as any,
  })

  return result
}

async function getMakes() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({ collection: 'makes', limit: 100, sort: 'name' })
  return docs
}

async function getFilterableFeatures() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'features',
    where: { filterable: { equals: true } },
    limit: 100,
    sort: 'category',
  })
  return docs
}

export default async function BoatsPage({
  params: routeParams,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<SearchParams>
}) {
  const { locale: localeParam } = await routeParams
  const locale = getLocaleFromParam(localeParam)
  const params = await searchParams
  const t = getTranslations(locale)
  const [result, makes, features] = await Promise.all([
    getBoats({ ...params, _locale: locale } as any),
    getMakes(),
    getFilterableFeatures(),
  ])

  return (
    <div className="container py-8">
      <h1 className={styles.pageTitle}>{t('boats_h1')}</h1>
      <p className={styles.intro}>{t('boats_intro')}</p>
      <div className={styles.page}>
        {/* ── Sidebar ──────────────────────── */}
        <aside className={styles.sidebar}>
          <FilterSidebar
            searchParams={params}
            makes={makes}
            filterableFeatures={features}
            locale={locale}
          />
        </aside>

        {/* ── Results ──────────────────────── */}
        <main className={styles.results}>
          <Suspense fallback={null}>
            <FavouritesBar active={params.favourites === '1'} locale={locale} />
          </Suspense>

          <div className={styles.resultsHeader}>
            <p className={styles.count}>
              {result.totalDocs} {result.totalDocs === 1 ? t('boat_found') : t('boats_found')}
            </p>
            <SortBar currentSort={params.sort} locale={locale} />
          </div>

          {result.docs.length === 0 ? (
            <div className={styles.empty}>
              <p>{t('no_results')}</p>
              <a href={localePath(locale, '/boats')} className="btn btn-outline mt-4">{t('clear_filters')}</a>
            </div>
          ) : (
            <div className="boats-grid">
              {result.docs.map((boat: any) => (
                <BoatCard key={boat.id} boat={boat} locale={locale} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {result.totalPages > 1 && (
            <div className={styles.pagination}>
              {Array.from({ length: result.totalPages }, (_, i) => i + 1).map(p => {
                const newParams = new URLSearchParams(params as any)
                newParams.set('page', String(p))
                return (
                  <a
                    key={p}
                    href={localePath(locale, `/boats?${newParams.toString()}`)}
                    className={`${styles.pageBtn} ${p === result.page ? styles.pageBtnActive : ''}`}
                  >
                    {p}
                  </a>
                )
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
