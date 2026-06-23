import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import Image from 'next/image'
import { TrailerFilters } from '@/components/boats/TrailerFilters'
import styles from './trailers.module.css'

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-EU', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price)
}

export default async function TrailersPage({
  searchParams,
}: {
  searchParams: Promise<{ condition?: string; price_max?: string }>
}) {
  const params = await searchParams
  const payload = await getPayload({ config })

  const where: Record<string, any> = { status: { equals: 'available' } }
  if (params.condition) where.condition = { equals: params.condition }
  if (params.price_max) where.price = { less_than_equal: Number(params.price_max) }

  const { docs: trailers, totalDocs } = await payload.find({
    collection: 'trailers',
    where,
    sort: '-createdAt',
    limit: 20,
    depth: 2,
  })

  return (
    <div className="container py-8">
      <div className={styles.header}>
        <div>
          <h1 className="section-title">Boat Trailers</h1>
          <p className="section-subtitle">{totalDocs} trailers available</p>
        </div>
        <TrailerFilters currentCondition={params.condition} currentPriceMax={params.price_max} />
      </div>

      {trailers.length === 0 ? (
        <p className={styles.empty}>No trailers currently available.</p>
      ) : (
        <div className={styles.grid}>
          {trailers.map((trailer: any) => {
            const img = typeof trailer.main_image === 'object' ? trailer.main_image : null
            return (
              <Link key={trailer.id} href={`/trailers/${trailer.slug}`} className={styles.card}>
                <div className={styles.cardImage}>
                  {img?.url ? (
                    <Image src={img.url} alt={img.alt || trailer.title} fill className={styles.img} sizes="320px" />
                  ) : (
                    <div className={styles.noImg}>No Image</div>
                  )}
                  <span className={`badge badge-${trailer.condition}`}>
                    {trailer.condition === 'new' ? 'New' : 'Used'}
                  </span>
                </div>
                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{trailer.title}</h3>
                  <div className={styles.cardSpecs}>
                    {trailer.make && <span>{trailer.make}</span>}
                    {trailer.length_m && <span>{trailer.length_m}m</span>}
                    {trailer.axles && <span>{trailer.axles} axle{trailer.axles > 1 ? 's' : ''}</span>}
                    {trailer.braked && <span>Braked</span>}
                  </div>
                  <p className={styles.cardPrice}>{formatPrice(trailer.price)}</p>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
