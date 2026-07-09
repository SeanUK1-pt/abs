import { Suspense } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { BoatCard } from '@/components/boats/BoatCard'
import { FilterSidebar } from '@/components/boats/FilterSidebar'
import { SortBar } from '@/components/boats/SortBar'
import { FavouritesBar } from '@/components/boats/FavouritesBar'
import { getLocale } from '@/lib/locale'
import { getTranslations } from '@/lib/translations'
import styles from './boats.module.css'

export const metadata = {
  title: 'Boats for Sale | Algarve Boat Sales',
  description: 'Browse new and used boats for sale in the Algarve, Portugal. RIBs, bowriders, day cruisers and more from authorised dealer Algarve Boat Sales in Lagos.',
  alternates: { canonical: 'https://www.algarveboatsales.com/boats' },
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
  ids?: string
}

async function getBoats(searchParams: SearchParams) {
  const payload = await getPayload({ config })
  const locale = (searchParams as any)._locale || 'en'

  // Favourites view: fetch exactly those boats by ID using explicit or conditions
  if (searchParams.ids) {
    const idList = searchParams.ids.split(',').filter(Boolean)
    if (idList.length > 0) {
      return payload.find({
        collection: 'boats',
        where: { or: idList.map(id => ({ id: { equals: id } })) },
        limit: 100,
        depth: 2,
        locale: locale as any,
      })
    }
  }

  const where: Record<string, any> = { status: { not_equals: 'sold' } }

  if (searchParams.condition) where.condition = { equals: searchParams.condition }
  if (searchParams.boat_type) where.boat_type = { equals: searchParams.boat_type }
  if (searchParams.fuel_type) where.fuel_type = { equals: searchParams.fuel_type }
  if (searchParams.drive_type) where.drive_type = { equals: searchParams.drive_type }
  if (searchParams.hull_material) where.hull_material = { equals: searchParams.hull_material }

  if (searchParams.price_min || searchParams.price_max) {
    where.price = {}
    if (searchParams.price_min) where.price.greater_than_equal = Number(searchParams.price_min)
    if (searchParams.price_max) where.price.less_than_equal = Number(searchParams.price_max)
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

  const sortMap: Record<string, string> = {
    price_asc: 'price',
    price_desc: '-price',
    newest: '-createdAt',
    length: 'length_m',
  }
  const sort = sortMap[searchParams.sort || 'newest'] || '-createdAt'

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
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const locale = await getLocale()
  const t = getTranslations(locale)
  const [result, makes, features] = await Promise.all([
    getBoats({ ...params, _locale: locale } as any),
    getMakes(),
    getFilterableFeatures(),
  ])

  return (
    <div className="container py-8">
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
            <FavouritesBar active={Boolean(params.ids)} />
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
              <a href="/boats" className="btn btn-outline mt-4">{t('clear_filters')}</a>
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
                    href={`/boats?${newParams.toString()}`}
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
