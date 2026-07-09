import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { BrandCarousel } from '@/components/ui/BrandCarousel'
import styles from './brands.module.css'
import { getLocale } from '@/lib/locale'
import { getPageData } from '@/lib/getPage'
import { getTranslations } from '@/lib/translations'
import { RichText } from '@/components/ui/RichText'
import { PageHero } from '@/components/ui/PageHero'

type ModelRange = { name: string; blurb: string; href: string }
type BrandModel = { name: string; href: string }
type Brand = {
  name: string
  short: string
  slug: string
  logo: string
  origin: string
  category: string
  website: string
  heroImg: string | null
  tileImages?: { src: string; alt: string }[]
  description: string
  highlight: string
  models?: BrandModel[]
  ranges?: ModelRange[]
  feature?: { name: string; tagline: string; href: string }
  yamahaPowered?: boolean
}

const BRAND_KEYS = ['grand', 'yamarin', 'spx', 'vanclaes']

async function getBrandImages(locale: string): Promise<Record<string, { src: string; alt: string }[]>> {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'boats',
    where: { status: { equals: 'available' } },
    limit: 80,
    sort: '-createdAt',
    locale: locale as any,
    depth: 2,
  })

  const map: Record<string, { src: string; alt: string }[]> = {}
  for (const b of docs as any[]) {
    const makeName = (typeof b.make === 'object' ? b.make?.name : '') || ''
    const key = BRAND_KEYS.find((k) => makeName.toLowerCase().includes(k))
    if (!key) continue
    const bucket = (map[key] ||= [])
    const candidates: any[] = [
      typeof b.main_image === 'object' ? b.main_image : null,
      ...(Array.isArray(b.gallery)
        ? b.gallery.map((g: any) => (typeof g?.image === 'object' ? g.image : null))
        : []),
    ]
    for (const img of candidates) {
      if (bucket.length >= 6) break
      if (img?.url && !bucket.some((x) => x.src === img.url)) {
        bucket.push({ src: img.url, alt: img.alt || b.title })
      }
    }
  }
  return map
}

function pickBrandImages(
  name: string,
  heroImg: string | null,
  map: Record<string, { src: string; alt: string }[]>,
  tileImages?: { src: string; alt: string }[],
) {
  if (tileImages && tileImages.length > 0) return tileImages
  const key = BRAND_KEYS.find((k) => name.toLowerCase().includes(k))
  const real = (key && map[key]) || []
  if (real.length > 0) return real
  return heroImg ? [{ src: heroImg, alt: name }] : []
}

export async function generateMetadata() {
  const locale = await getLocale()
  const page = await getPageData('brands', locale)
  return {
    title: page?.title ? `${page.title} | Algarve Boat Sales` : 'Exclusive Brands | Algarve Boat Sales',
    description: page?.meta_description || 'Authorised Algarve dealer for GRAND, Yamarin, SPX RIB and Vanclaes.',
    alternates: { canonical: 'https://www.algarveboatsales.com/brands' },
  }
}

export default async function BrandsPage() {
  const locale = await getLocale()
  const page = await getPageData('brands', locale)
  const imagesByBrand = await getBrandImages(locale)
  const t = getTranslations(locale)

  const BRANDS: Brand[] = [
    {
      name: 'GRAND Inflatables',
      short: 'GRAND',
      slug: 'grand-inflatables',
      yamahaPowered: true,
      logo: '/media/grand-logo.png',
      origin: 'Ukraine',
      category: 'RIB / Inflatable',
      website: 'https://grandboats.com',
      heroImg: '/media/hero-grand.png',
      tileImages: [
        { src: '/media/grand-tile-1.jpg', alt: 'GRAND RIB' },
        { src: '/media/grand-tile-2.jpg', alt: 'GRAND RIB' },
        { src: '/media/grand-tile-3.jpg', alt: 'GRAND RIB' },
        { src: '/media/grand-tile-4.jpg', alt: 'GRAND RIB' },
      ],
      description: t('brand_grand_desc'),
      highlight: t('brand_grand_highlight'),
      feature: {
        name: t('brand_grand_feature_name'),
        tagline: t('brand_grand_feature_tagline'),
        href: 'https://grandboats.com/en/golden-line/23-golden-line-g980.html',
      },
      ranges: [
        { name: t('brand_grand_r0_name'), blurb: t('brand_grand_r0_blurb'), href: 'https://grandboats.com/en/golden-line-3' },
        { name: t('brand_grand_r1_name'), blurb: t('brand_grand_r1_blurb'), href: 'https://grandboats.com/en/silver-line-4' },
        { name: t('brand_grand_r2_name'), blurb: t('brand_grand_r2_blurb'), href: 'https://grandboats.com/en/drive-line-5' },
      ],
    },
    {
      name: 'Yamarin',
      short: 'Yamarin',
      slug: 'yamarin',
      yamahaPowered: true,
      logo: '/media/yamarin-logo.png',
      origin: 'Finland',
      category: 'Bowrider / Day Cruiser',
      website: 'https://yamarin.com',
      heroImg: '/media/yamarin_hero-scaled.jpg',
      description: t('brand_yamarin_desc'),
      highlight: t('brand_yamarin_highlight'),
      feature: {
        name: t('brand_yamarin_feature_name'),
        tagline: t('brand_yamarin_feature_tagline'),
        href: 'https://yamarin.com/fi/yamarin-aura-cabin',
      },
      ranges: [
        { name: t('brand_yamarin_r0_name'), blurb: t('brand_yamarin_r0_blurb'), href: 'https://yamarin.com/fi/day-cruiser-retkiveneet' },
        { name: t('brand_yamarin_r1_name'), blurb: t('brand_yamarin_r1_blurb'), href: 'https://yamarin.com/en/mallisto' },
        { name: t('brand_yamarin_r2_name'), blurb: t('brand_yamarin_r2_blurb'), href: 'https://yamarin.com/en/mallisto' },
      ],
    },
    {
      name: 'SPX RIB',
      short: 'SPX RIB',
      slug: 'spx-rib',
      yamahaPowered: true,
      logo: '/media/spx-logo.png',
      origin: 'Italy (Sicily)',
      category: 'Luxury RIB',
      website: 'https://www.spxrib.com',
      heroImg: '/media/hero-spx.png',
      tileImages: [
        { src: '/media/spx-tile-1.webp', alt: 'SPX RIB' },
        { src: '/media/spx-tile-3.webp', alt: 'SPX RIB' },
        { src: '/media/spx-tile-4.webp', alt: 'SPX RIB' },
        { src: '/media/spx-tile-5.jpg', alt: 'SPX RIB' },
      ],
      description: t('brand_spx_desc'),
      highlight: t('brand_spx_highlight'),
      models: [
        { name: t('brand_spx_m0_name'), href: 'https://www.spxrib.com/spx-24/' },
        { name: t('brand_spx_m1_name'), href: 'https://www.spxrib.com/spx-32/' },
        { name: t('brand_spx_m2_name'), href: 'https://www.spxrib.com/spx-38/' },
      ],
    },
    {
      name: 'Vanclaes',
      short: 'Vanclaes',
      slug: 'vanclaes',
      logo: '/media/vanclaes-logo.png',
      origin: 'Netherlands',
      category: 'Boat Trailers',
      website: 'https://vanclaes.com',
      heroImg: '/media/brands-vanclaes.png',
      description: t('brand_vanclaes_desc'),
      highlight: t('brand_vanclaes_highlight'),
      models: [
        { name: t('brand_vanclaes_m0_name'), href: 'https://vanclaes.com/rib-marine-wave-1350-13-550-geremd-1-as/p-2110.html' },
        { name: t('brand_vanclaes_m1_name'), href: 'https://vanclaes.com/rib-marine-wave-1800-14-600-geremd-1-as/p-1646.html' },
        { name: t('brand_vanclaes_m2_name'), href: 'https://vanclaes.com/rib-marine-wave-2750-13-650-geremd-2-as/p-2145.html' },
      ],
    },
  ]

  return (
    <>
      <PageHero
        title={t('brands_page_title')}
        subtitle={t('brands_page_subtitle')}
        imageSrc="/media/SPX_main_hero-1-scaled.jpg"
        imageAlt="An SPX RIB underway near the coast"
      />

      <div className="container">
        <section className={styles.intro}>
          <p>{t('brands_page_intro')}</p>
        </section>

        <div className={styles.brands}>
          {BRANDS.map(({ name, short, slug, logo, origin, category, description, models, ranges, feature, highlight, heroImg, tileImages, website, yamahaPowered }) => (
            <article key={name} id={slug} className={styles.brand}>
              <div className={styles.media}>
                <BrandCarousel images={pickBrandImages(name, heroImg, imagesByBrand, tileImages)} name={name} fill />
                {yamahaPowered && (
                  <span className={styles.yamahaBadge}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/brands/yamaha-empowered-by.svg" alt="Empowered by Yamaha" />
                  </span>
                )}
              </div>

              <div className={styles.body}>
                <div className={styles.brandTop}>
                  {logo && (
                    <span className={styles.logoBox}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={logo} alt={`${name} logo`} className={styles.logo} />
                    </span>
                  )}
                  <div className={styles.meta}>
                    <span className={styles.tag}>{category}</span>
                    <span className={styles.origin}>{origin}</span>
                  </div>
                </div>

                <h2 className={styles.name}>{name}</h2>
                <p className={styles.highlight}>{highlight}</p>
                <p className={styles.desc}>{description}</p>

                <div className={styles.rangeBlock}>
                  <span className={styles.rangeLabel}>{ranges ? t('brands_model_ranges') : t('brands_model_range')}</span>

                  {feature && (
                    <a href={feature.href} target="_blank" rel="noopener noreferrer" className={styles.featureTile}>
                      <span className={styles.featureBadge}>{t('brands_new_badge')}</span>
                      <span className={styles.featureName}>{feature.name}</span>
                      <span className={styles.featureTagline}>{feature.tagline}</span>
                      <svg className={styles.featureArrow} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6" /></svg>
                    </a>
                  )}

                  {ranges ? (
                    <div className={styles.rangeGrid}>
                      {ranges.map((r) => (
                        <a key={r.name} href={r.href} target="_blank" rel="noopener noreferrer" className={styles.rangeTile}>
                          <span className={styles.rangeName}>{r.name}</span>
                          <span className={styles.rangeBlurb}>{r.blurb}</span>
                          <span className={styles.rangeMore}>
                            {t('brands_view_range')}
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6" /></svg>
                          </span>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className={styles.modelGrid}>
                      {models?.map((m) => (
                        <a key={m.name} href={m.href} target="_blank" rel="noopener noreferrer" className={styles.modelPanel}>
                          <span>{m.name}</span>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6" /></svg>
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                <div className={styles.actions}>
                  <Link href={`/boats?make=${slug}`} className="btn btn-gold">
                    {t('brands_view_boats').replace('{brand}', short)}
                  </Link>
                  {website && (
                    <a href={website} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                      {t('brands_visit_website')}
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        <section className={styles.cta}>
          <h2>{t('brands_cta_title')}</h2>
          <p>{t('brands_cta_body')}</p>
          <div className={styles.ctaBtns}>
            <Link href="/boats" className="btn btn-gold">{t('brands_browse_all')}</Link>
            <Link href="/contact" className="btn btn-outline-white">{t('brands_request_info')}</Link>
          </div>
        </section>
      </div>

      {page?.content && (
        <div className="container" style={{ paddingBottom: '3rem' }}>
          <RichText content={page.content} className="richtext-content" />
        </div>
      )}
    </>
  )
}
