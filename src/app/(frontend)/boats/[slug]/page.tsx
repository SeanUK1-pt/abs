import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import { EnquiryForm } from '@/components/forms/EnquiryForm'
import { BoatCard } from '@/components/boats/BoatCard'
import { GalleryGrid } from '@/components/boats/GalleryGrid'
import { RichText } from '@/components/ui/RichText'
import { getLocale } from '@/lib/locale'
import { getTranslations } from '@/lib/translations'
import styles from './boat.module.css'

async function getBoat(slug: string, locale: string) {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'boats',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 3,
    locale: locale as any,
  })
  return docs[0] || null
}

async function getRelatedBoats(boat: any) {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'boats',
    where: {
      and: [
        { status: { not_equals: 'sold' } },
        { id: { not_equals: boat.id } },
        {
          or: [
            { make: { equals: boat.make?.id || boat.make } },
            { boat_type: { equals: boat.boat_type } },
          ],
        },
      ],
    },
    limit: 3,
    depth: 2,
  })
  return docs
}

function formatPrice(price: number, currency = 'EUR') {
  return new Intl.NumberFormat('en-EU', { style: 'currency', currency, maximumFractionDigits: 0 }).format(price)
}

const STATUS_LABELS: Record<string, Record<string, string>> = {
  en: { available: 'Available', under_offer: 'Under Offer', sold: 'Sold' },
  pt: { available: 'Disponível', under_offer: 'Em Negociação', sold: 'Vendido' },
}

export default async function BoatPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const locale = await getLocale()
  const t = getTranslations(locale)
  const boat = await getBoat(slug, locale)
  if (!boat) notFound()

  const related = await getRelatedBoats(boat)
  const make = typeof boat.make === 'object' ? boat.make?.name : ''
  const model = typeof boat.model === 'object' ? boat.model?.name : ''
  const mainImage = typeof boat.main_image === 'object' ? boat.main_image : null
  const galleryImages = (boat.gallery || []).map((g: any) =>
    typeof g.image === 'object' ? g.image : null
  ).filter(Boolean)

  const allImages = [mainImage, ...galleryImages].filter(Boolean)

  const statusLabels = STATUS_LABELS[locale] || STATUS_LABELS.en

  const specs = [
    { label: t('spec_make'), value: make },
    { label: t('spec_model'), value: model },
    { label: t('spec_year'), value: boat.year },
    { label: t('spec_length'), value: boat.length_m ? `${boat.length_m}m` : null },
    { label: t('spec_beam'), value: boat.beam_m ? `${boat.beam_m}m` : null },
    { label: t('spec_engine_hours'), value: boat.engine_hours != null ? `${boat.engine_hours}h` : null },
    { label: t('spec_engine'), value: [
        boat.engine_make,
        boat.engine_model,
        boat.engine_hp ? `${boat.engine_hp}hp` : null,
        boat.engine_count === 2 ? t('spec_engine_twin') : boat.engine_count === 1 ? t('spec_engine_single') : null,
      ].filter(Boolean).join(' ') || null },
    { label: t('spec_capacity'), value: boat.max_capacity ? `${boat.max_capacity} ${t('spec_capacity_unit')}` : null },
    { label: t('spec_fuel'), value: boat.fuel_type },
    { label: t('spec_drive'), value: boat.drive_type },
    { label: t('spec_hull'), value: boat.hull_material },
    { label: t('spec_type'), value: boat.boat_type?.replace(/_/g, ' ') },
    { label: t('spec_ce'), value: boat.ce_category ? `Cat. ${boat.ce_category}` : null },
    { label: t('spec_condition'), value: boat.condition },
    { label: t('spec_stock'), value: boat.stock_number },
    { label: t('spec_location'), value: boat.location },
  ].filter(s => s.value)

  // Group features by category
  const featuresByCategory: Record<string, any[]> = {}
  for (const feat of (boat.features || [])) {
    const f = typeof feat === 'object' ? feat : { name: feat, category: 'other' }
    if (!featuresByCategory[f.category]) featuresByCategory[f.category] = []
    featuresByCategory[f.category].push(f)
  }

  return (
    <>
      <div className={`container ${styles.page}`}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb}>
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/boats">{t('nav_boats')}</Link>
          <span>/</span>
          <span>{boat.title}</span>
        </nav>

        <div className={styles.layout}>
          {/* ── Left: Images + Details ─────────── */}
          <div className={styles.main}>
            <GalleryGrid images={allImages} title={boat.title} />

            {/* Specs */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{t('specifications')}</h2>
              <div className={styles.specsGrid}>
                {specs.map(({ label, value }) => (
                  <div key={label} className={styles.specRow}>
                    <span className={styles.specLabel}>{label}</span>
                    <span className={styles.specValue}>{String(value)}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Description */}
            {boat.description && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>{t('description')}</h2>
                <RichText content={boat.description} className={styles.richText} />
              </section>
            )}

            {/* Features */}
            {Object.keys(featuresByCategory).length > 0 && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>{t('features_equipment')}</h2>
                {Object.entries(featuresByCategory).map(([category, feats]) => (
                  <div key={category} className={styles.featureGroup}>
                    <h3 className={styles.featureCategory}>{category}</h3>
                    <ul className={styles.featureList}>
                      {feats.map((f: any) => (
                        <li key={f.id || f.name} className={styles.featureItem}>
                          <span className={styles.featureDot} />
                          {f.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                {boat.custom_features?.length > 0 && (
                  <div className={styles.featureGroup}>
                    <h3 className={styles.featureCategory}>Additional</h3>
                    <ul className={styles.featureList}>
                      {boat.custom_features.map((cf: any, i: number) => (
                        <li key={i} className={styles.featureItem}>
                          <span className={styles.featureDot} />
                          {cf.feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            )}

            {/* New boat options */}
            {boat.condition === 'new' && boat.options?.length > 0 && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>{t('factory_options')}</h2>
                <div className={styles.optionsGrid}>
                  {boat.options.map((opt: any, i: number) => (
                    <div key={i} className={styles.optionCard}>
                      <span className={styles.optionName}>{opt.option_name}</span>
                      {opt.option_price && (
                        <span className={styles.optionPrice}>+{formatPrice(opt.option_price)}</span>
                      )}
                      {opt.option_description && (
                        <p className={styles.optionDesc}>{opt.option_description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* ── Right: Price + Enquiry ─────────── */}
          <aside className={styles.sidebar}>
            {/* Price card */}
            <div className={styles.priceCard}>
              <div className={styles.titleRow}>
                <h1 className={styles.boatTitle}>{boat.title}</h1>
                <span className={`badge badge-${boat.status?.replace('_', '-')}`}>
                  {statusLabels[boat.status] || boat.status}
                </span>
              </div>

              {make && model && (
                <p className={styles.makeModelLine}>{make} · {model}</p>
              )}

              <div className={styles.priceRow}>
                {boat.sale_price ? (
                  <>
                    <span className={styles.oldPrice}>{formatPrice(boat.price, boat.currency)}</span>
                    <span className={styles.price}>{formatPrice(boat.sale_price, boat.currency)}</span>
                  </>
                ) : (
                  <span className={styles.price}>{formatPrice(boat.price, boat.currency)}</span>
                )}
              </div>

              <p className={styles.ivaNote}>
                {boat.iva_included ? t('iva_included') : t('plus_iva')}
              </p>

              {boat.location && (
                <p className={styles.location}>📍 {boat.location}</p>
              )}

              {boat.brochure && typeof boat.brochure === 'object' && (
                <a
                  href={(boat.brochure as any).url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`btn btn-outline ${styles.brochureBtn}`}
                >
                  📄 {t('download_brochure')}
                </a>
              )}

              {boat.video_url && (
                <a href={boat.video_url} target="_blank" rel="noopener noreferrer" className={`btn btn-outline ${styles.brochureBtn}`}>
                  ▶ {t('watch_video')}
                </a>
              )}
            </div>

            {/* Enquiry form */}
            <div className={styles.enquiryCard}>
              <h3>{t('enquire_boat')}</h3>
              <EnquiryForm
                listingTitle={boat.title}
                listingType="boat"
                listingId={String(boat.id)}
                locale={locale}
              />
            </div>
          </aside>
        </div>

        {/* Related boats */}
        {related.length > 0 && (
          <section className={styles.related}>
            <h2 className="section-title">{t('you_may_like')}</h2>
            <div className="boats-grid">
              {related.map((b: any) => <BoatCard key={b.id} boat={b} locale={locale} />)}
            </div>
          </section>
        )}
      </div>
    </>
  )
}
