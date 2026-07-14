import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import { EnquiryForm } from '@/components/forms/EnquiryForm'
import { BoatCard } from '@/components/boats/BoatCard'
import { FavouriteTextButton } from '@/components/boats/FavouriteButton'
import { GalleryGrid } from '@/components/boats/GalleryGrid'
import { RichText } from '@/components/ui/RichText'
import { getLocaleFromParam } from '@/lib/locale'
import { getTranslations } from '@/lib/translations'
import { localePath, hreflangAlternates } from '@/lib/localePath'
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

const CANONICAL_ORIGIN = 'https://www.algarveboatsales.com'

function absoluteUrl(url: string | null | undefined): string | null {
  if (!url) return null
  return url.startsWith('http') ? url : `${CANONICAL_ORIGIN}${url}`
}

function extractPlainText(content: any, maxLength = 300): string {
  if (!content) return ''
  if (typeof content === 'string') return content.slice(0, maxLength)
  const texts: string[] = []
  function walk(node: any) {
    if (node?.text) texts.push(node.text)
    if (node?.children) node.children.forEach(walk)
  }
  const nodes = content?.root?.children || content?.children || []
  nodes.forEach(walk)
  return texts.join(' ').replace(/\s+/g, ' ').trim().slice(0, maxLength)
}

function buildJsonLd(boat: any, make: string, model: string, slug: string) {
  const price = boat.sale_price || boat.price
  const currency = boat.currency || 'EUR'
  const url = `${CANONICAL_ORIGIN}/boats/${slug}`

  const availabilityMap: Record<string, string> = {
    available: 'https://schema.org/InStock',
    under_offer: 'https://schema.org/LimitedAvailability',
    sold: 'https://schema.org/OutOfStock',
  }
  const conditionMap: Record<string, string> = {
    new: 'https://schema.org/NewCondition',
    used: 'https://schema.org/UsedCondition',
  }

  const mainImg = typeof boat.main_image === 'object' ? boat.main_image : null
  const galleryImgs = (boat.gallery || [])
    .map((g: any) => (typeof g.image === 'object' ? g.image : null))
    .filter(Boolean)
  const images = [mainImg, ...galleryImgs]
    .filter(Boolean)
    .map((img: any) => absoluteUrl(img.url))
    .filter(Boolean)

  const nameParts = [make, model, boat.year].filter(Boolean)
  const name = nameParts.join(' ') || boat.title

  const descFromContent = extractPlainText(boat.description)
  const descFallbackParts = [
    make && model ? `${make} ${model}` : null,
    boat.year ? String(boat.year) : null,
    boat.length_m ? `${boat.length_m}m` : null,
    boat.condition === 'new' ? 'new boat' : 'used boat',
    'for sale at Algarve Boat Sales, Lagos, Algarve.',
  ].filter(Boolean)
  const description = descFromContent || descFallbackParts.join(' ')

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    url,
    ...(images.length > 0 && { image: images.length === 1 ? images[0] : images }),
    ...(make && { brand: { '@type': 'Brand', name: make } }),
    ...(model && { model }),
    ...(boat.year && { productionDate: String(boat.year) }),
    ...(boat.length_m && { depth: `${boat.length_m}m` }),
    offers: {
      '@type': 'Offer',
      url,
      price: price,
      priceCurrency: currency,
      availability: availabilityMap[boat.status] || 'https://schema.org/InStock',
      itemCondition: conditionMap[boat.condition] || 'https://schema.org/UsedCondition',
      seller: {
        '@type': 'Organization',
        name: 'Algarve Boat Sales',
        url: CANONICAL_ORIGIN,
      },
    },
  }
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: localeParam, slug } = await params
  const locale = getLocaleFromParam(localeParam)
  const boat = await getBoat(slug, locale)
  if (!boat) return {}

  const t = getTranslations(locale)
  const make = typeof boat.make === 'object' ? (boat.make?.name ?? '') : (boat.make ?? '')
  const model = typeof boat.model === 'object' ? (boat.model?.name ?? '') : (boat.model ?? '')
  const year = boat.year ? String(boat.year) : ''
  const parts = [make, model, year].filter(Boolean)
  const title = parts.length
    ? `${parts.join(' ')} ${t('meta_boat_for_sale')} | Algarve Boat Sales`
    : t('meta_boat_fallback_title')

  const descParts: string[] = []
  if (make && model) descParts.push(`${make} ${model}`)
  if (year) descParts.push(year)
  if (boat.length_m) descParts.push(`${boat.length_m}m`)
  const price = boat.sale_price || boat.price
  if (price) descParts.push(new Intl.NumberFormat('en-EU', { style: 'currency', currency: boat.currency || 'EUR', maximumFractionDigits: 0 }).format(price))
  const base = descParts.join(' · ')
  const description = (base + ' ' + t('meta_boat_available')).trim().slice(0, 160)

  const canonical = locale === 'pt'
    ? `https://www.algarveboatsales.com/pt/boats/${slug}`
    : `https://www.algarveboatsales.com/boats/${slug}`

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: hreflangAlternates(`/boats/${slug}`),
    },
    openGraph: { title, description, url: canonical },
  }
}

export default async function BoatPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: localeParam, slug } = await params
  const locale = getLocaleFromParam(localeParam)
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

  const engineCountLabel = (n: number | null | undefined) => {
    if (!n) return null
    if (n === 1) return t('spec_engine_single')
    if (n === 2) return t('spec_engine_twin')
    return `${n}`
  }

  const overviewLeft = [
    { label: t('spec_make'), value: make },
    { label: t('spec_model'), value: model },
    { label: t('spec_year'), value: boat.year },
    { label: t('spec_condition'), value: boat.condition },
    { label: t('spec_stock'), value: boat.stock_number },
  ].filter(s => s.value)

  const overviewRight = [
    { label: t('spec_type'), value: boat.boat_type?.replace(/_/g, ' ') },
    { label: t('spec_length'), value: boat.length_m ? `${boat.length_m}m` : null },
    { label: t('spec_beam'), value: boat.beam_m ? `${boat.beam_m}m` : null },
    { label: t('spec_hull'), value: boat.hull_material },
    { label: t('spec_location'), value: boat.location },
  ].filter(s => s.value)

  const engineSpecs = [
    { label: t('spec_engine_make'), value: boat.engine_make },
    { label: t('spec_engine_model'), value: boat.engine_model },
    { label: t('spec_engine_hp'), value: boat.engine_hp ? `${boat.engine_hp}hp` : null },
    { label: t('spec_engine_count'), value: engineCountLabel(boat.engine_count) },
    { label: t('spec_fuel'), value: boat.fuel_type },
    { label: t('spec_drive'), value: boat.drive_type },
    { label: t('spec_engine_hours'), value: boat.engine_hours != null ? `${boat.engine_hours}h` : null },
    { label: t('spec_capacity'), value: boat.max_capacity ? `${boat.max_capacity} ${t('spec_capacity_unit')}` : null },
  ].filter(s => s.value)

  // Group features by category
  const featuresByCategory: Record<string, any[]> = {}
  for (const feat of (boat.features || [])) {
    const f = typeof feat === 'object' ? feat : { name: feat, category: 'other' }
    if (!featuresByCategory[f.category]) featuresByCategory[f.category] = []
    featuresByCategory[f.category].push(f)
  }

  const jsonLd = buildJsonLd(boat, make || '', model || '', slug)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className={`container ${styles.page}`}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb}>
          <Link href={localePath(locale, '/')}>Home</Link>
          <span>/</span>
          <Link href={localePath(locale, '/boats')}>{t('nav_boats')}</Link>
          <span>/</span>
          <span>{boat.title}</span>
        </nav>

        {/* Title + make/model + status — full width, first */}
        <header className={styles.detailHeader}>
          <div className={styles.titleRow}>
            <h1 className={styles.boatTitle}>{boat.title}</h1>
            <span className={`badge badge-${boat.status?.replace('_', '-')}`}>
              {statusLabels[boat.status] || boat.status}
            </span>
          </div>
          {make && model && (
            <p className={styles.makeModelLine}>{make} · {model}</p>
          )}
        </header>

        <div className={styles.layout}>
          {/* Pictures */}
          <div className={styles.galleryArea}>
            <GalleryGrid images={allImages} title={boat.title} />
          </div>

          {/* CTA: Price + Enquiry */}
          <aside className={styles.sidebar}>
            <div className={styles.priceCard}>
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

              <FavouriteTextButton boatId={String(boat.id)} locale={locale} />

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

          {/* Details: specs, description, features */}
          <div className={styles.main}>
            {/* Specs */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{t('specifications')}</h2>

              {(overviewLeft.length > 0 || overviewRight.length > 0) && (
                <div className={styles.specGroup}>
                  <h3 className={styles.specGroupTitle}>Overview</h3>
                  <div className={styles.specsColumns}>
                    <div>
                      <p className={styles.specsColLabel}>Identity &amp; Listing</p>
                      <div className={styles.specsGrid}>
                        {overviewLeft.map(({ label, value }) => (
                          <div key={label} className={styles.specRow}>
                            <span className={styles.specLabel}>{label}</span>
                            <span className={styles.specValue}>{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className={styles.specsColLabel}>Boat Facts</p>
                      <div className={styles.specsGrid}>
                        {overviewRight.map(({ label, value }) => (
                          <div key={label} className={styles.specRow}>
                            <span className={styles.specLabel}>{label}</span>
                            <span className={styles.specValue}>{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {engineSpecs.length > 0 && (
                <div className={styles.specGroup}>
                  <h3 className={styles.specGroupTitle}>Engine &amp; Performance</h3>
                  <div className={styles.specsGrid}>
                    {engineSpecs.map(({ label, value }) => (
                      <div key={label} className={styles.specRow}>
                        <span className={styles.specLabel}>{label}</span>
                        <span className={styles.specValue}>{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
