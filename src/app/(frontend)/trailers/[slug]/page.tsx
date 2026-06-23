import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { EnquiryForm } from '@/components/forms/EnquiryForm'
import { GalleryGrid } from '@/components/boats/GalleryGrid'
import styles from './trailer.module.css'

export default async function TrailerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'trailers',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })
  const trailer = docs[0]
  if (!trailer) notFound()

  const mainImage = typeof trailer.main_image === 'object' ? trailer.main_image : null
  const galleryImages = (trailer.gallery || []).map((g: any) =>
    typeof g.image === 'object' ? g.image : null
  ).filter(Boolean)
  const allImages = [mainImage, ...galleryImages].filter(Boolean)

  const specs = [
    { label: 'Make', value: trailer.make },
    { label: 'Model', value: trailer.model },
    { label: 'Year', value: trailer.year },
    { label: 'Condition', value: trailer.condition },
    { label: 'Length', value: trailer.length_m ? `${trailer.length_m}m` : null },
    { label: 'Width', value: trailer.width_m ? `${trailer.width_m}m` : null },
    { label: 'Gross Weight', value: trailer.gross_weight_kg ? `${trailer.gross_weight_kg}kg` : null },
    { label: 'Payload', value: trailer.payload_kg ? `${trailer.payload_kg}kg` : null },
    { label: 'Axles', value: trailer.axles },
    { label: 'Braked', value: trailer.braked ? 'Yes' : 'No' },
    { label: 'Tyre Size', value: trailer.tire_size },
    { label: 'Construction', value: trailer.construction },
    { label: 'Location', value: trailer.location },
  ].filter(s => s.value != null && s.value !== '')

  const price = new Intl.NumberFormat('en-EU', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(trailer.price)

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.layout}>
        <div className={styles.main}>
          <GalleryGrid images={allImages} title={trailer.title} />
          <section className={styles.specsSection}>
            <h2>Specifications</h2>
            <div className={styles.specs}>
              {specs.map(({ label, value }) => (
                <div key={label} className={styles.specRow}>
                  <span>{label}</span>
                  <span>{String(value)}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.priceCard}>
            <h1 className={styles.title}>{trailer.title}</h1>
            <div className={styles.price}>{price}</div>
            <p className={styles.iva}>{trailer.iva_included ? 'IVA included' : 'Plus IVA'}</p>
          </div>
          <div className={styles.enquiryCard}>
            <h3>Enquire About This Trailer</h3>
            <EnquiryForm listingTitle={trailer.title} listingType="trailer" listingId={String(trailer.id)} />
          </div>
        </aside>
      </div>
    </div>
  )
}
