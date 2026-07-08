import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import Image from 'next/image'
import { TrailerFilters } from '@/components/boats/TrailerFilters'
import { TrailerConfigurator } from '@/components/boats/TrailerConfigurator'
import { PageHero } from '@/components/ui/PageHero'
import styles from './trailers.module.css'

export const metadata = {
  title: 'Boat Trailers | Algarve Boat Sales',
  description: 'New and used boat trailers in the Algarve. Authorised Vanclaes dealer offering stainless steel trailer supply, fitting and IVA registration across Portugal.',
  alternates: { canonical: 'https://www.algarveboatsales.com/trailers' },
}

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
    <>
      <PageHero
        title="Boat Trailers"
        subtitle="Vanclaes trailers — one of Europe's leading manufacturers — sized precisely for your vessel"
        imageSrc="/services/trailer.jpg"
        imageAlt="A stainless steel boat trailer with a RIB loaded on it"
      />

      <div className="container py-8">
        <div className={styles.configuratorNav}>
          <span className={styles.configuratorEyebrow}>New Trailers &middot; Vanclaes</span>
          <a href="#used-trailers" className={styles.back}>
            View used trailers &darr;
          </a>
        </div>

        <TrailerConfigurator />

        <section className={styles.configuratorHelp}>
          <h2>Not sure which trailer you need?</h2>
          <p>
            Our team will match a Vanclaes trailer to your boat&apos;s weight and dimensions, then
            handle supply, fitting and IVA registration throughout Portugal. Send us your build and
            we&apos;ll take care of the rest.
          </p>
          <Link href="/contact" className="btn btn-gold">Talk to our team</Link>
        </section>
      </div>

      <div id="used-trailers" className="container py-8">
        <div className={styles.toolbar}>
          <p className={styles.count}>
            <strong>{totalDocs}</strong> used trailer{totalDocs === 1 ? '' : 's'} available
          </p>
          <TrailerFilters currentCondition={params.condition} currentPriceMax={params.price_max} />
        </div>

        {trailers.length === 0 ? (
          <div className={styles.empty}>
            <p>No trailers currently available.</p>
            <Link href="/contact" className="btn btn-outline">Enquire about trailers</Link>
          </div>
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

        <section className={styles.cta}>
          <h2>Looking for a specific trailer?</h2>
          <p>We supply and fit Vanclaes trailers sized precisely for your boat, with IVA registration assistance and delivery throughout Portugal.</p>
          <Link href="/contact" className="btn btn-gold">Enquire Now</Link>
        </section>
      </div>
    </>
  )
}
