import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { EnquiryForm } from '@/components/forms/EnquiryForm'
import { GalleryGrid } from '@/components/boats/GalleryGrid'
import { getLocaleFromParam } from '@/lib/locale'
import { getTranslations } from '@/lib/translations'
import { hreflangAlternates } from '@/lib/localePath'
import styles from './trailer.module.css'

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: localeParam, slug } = await params
  const locale = getLocaleFromParam(localeParam)
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'trailers',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  })
  const trailer = docs[0]
  if (!trailer) return {}
  const title = `${trailer.title} | Algarve Boat Sales`
  const canonical = locale === 'pt'
    ? `https://www.algarveboatsales.com/pt/trailers/${slug}`
    : `https://www.algarveboatsales.com/trailers/${slug}`
  return {
    title,
    alternates: {
      canonical,
      languages: hreflangAlternates(`/trailers/${slug}`),
    },
  }
}

export default async function TrailerPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: localeParam, slug } = await params
  const locale = getLocaleFromParam(localeParam)
  const t = getTranslations(locale)
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
    { label: t('trailers_spec_make'), value: trailer.make },
    { label: t('trailers_spec_model'), value: trailer.model },
    { label: t('trailers_spec_year'), value: trailer.year },
    { label: t('trailers_spec_condition'), value: trailer.condition === 'new' ? t('condition_new') : trailer.condition === 'used' ? t('condition_used') : trailer.condition },
    { label: t('trailers_spec_length'), value: trailer.length_m ? `${trailer.length_m}m` : null },
    { label: t('trailers_spec_width'), value: trailer.width_m ? `${trailer.width_m}m` : null },
    { label: t('trailers_spec_gross_weight'), value: trailer.gross_weight_kg ? `${trailer.gross_weight_kg}kg` : null },
    { label: t('trailers_spec_payload'), value: trailer.payload_kg ? `${trailer.payload_kg}kg` : null },
    { label: t('trailers_spec_axles'), value: trailer.axles },
    { label: t('trailers_spec_braked'), value: trailer.braked ? t('trailers_yes') : t('trailers_no') },
    { label: t('trailers_spec_tyre_size'), value: trailer.tire_size },
    { label: t('trailers_spec_construction'), value: trailer.construction },
    { label: t('trailers_spec_location'), value: trailer.location },
  ].filter(s => s.value != null && s.value !== '')

  const price = new Intl.NumberFormat('en-EU', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(trailer.price)

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.layout}>
        <div className={styles.main}>
          <GalleryGrid images={allImages} title={trailer.title} />
          <section className={styles.specsSection}>
            <h2>{t('trailers_specifications')}</h2>
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
            <p className={styles.iva}>{trailer.iva_included ? t('iva_included') : t('plus_iva')}</p>
          </div>
          <div className={styles.enquiryCard}>
            <h3>{t('trailers_enquire_about_trailer')}</h3>
            <EnquiryForm listingTitle={trailer.title} listingType="trailer" listingId={String(trailer.id)} />
          </div>
        </aside>
      </div>
    </div>
  )
}
