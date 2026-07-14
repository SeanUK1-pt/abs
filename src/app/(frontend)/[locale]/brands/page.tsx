import Link from 'next/link'
import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'
import config from '@payload-config'
import { BrandCarousel } from '@/components/ui/BrandCarousel'
import styles from './brands.module.css'
import { getLocaleFromParam } from '@/lib/locale'
import { getPageData } from '@/lib/getPage'
import { getTranslations } from '@/lib/translations'
import { RichText } from '@/components/ui/RichText'
import { PageHero } from '@/components/ui/PageHero'
import { localePath, hreflangAlternates } from '@/lib/localePath'

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
  description: string
  highlight: string
  models?: BrandModel[]
  ranges?: ModelRange[]
  feature?: { name: string; tagline: string; href: string; noImg?: boolean }
  yamahaPowered?: boolean
  primaryHref?: string
}

const BRAND_KEYS = ['grand', 'yamarin', 'spx', 'vanclaes']

type BrandImageData = {
  images: { src: string; alt: string }[]
  featureImg: { src: string; alt: string } | null
}

function getBrandImages(): Record<string, BrandImageData> {
  const mediaDir = path.join(process.cwd(), 'public', 'media')
  let files: string[] = []
  try { files = fs.readdirSync(mediaDir) } catch { /* media dir not present in this env */ }

  const map: Record<string, BrandImageData> = {}

  for (const key of BRAND_KEYS) {
    const tile = files.filter(f => f.includes(`${key}-tile`)).sort()
    const aura = files.filter(f => f.includes(`${key}-aura`)).sort()
    const fallback = files.filter(f => f.toLowerCase().startsWith(key)).sort()

    const imageSrcs = (tile.length > 0 ? tile : fallback).slice(0, 8)
    map[key] = {
      images: imageSrcs.map(f => ({ src: `/media/${f}`, alt: key })),
      featureImg: aura[0] ? { src: `/media/${aura[0]}`, alt: key } : null,
    }
  }

  return map
}

function pickBrandImages(
  name: string,
  heroImg: string | null,
  map: Record<string, BrandImageData>,
) {
  const key = BRAND_KEYS.find((k) => name.toLowerCase().includes(k))
  const images = (key && map[key]?.images) || []
  if (images.length > 0) return images
  return heroImg ? [{ src: heroImg, alt: name }] : []
}

function pickFeatureImg(name: string, map: Record<string, BrandImageData>) {
  const key = BRAND_KEYS.find((k) => name.toLowerCase().includes(k))
  return (key && map[key]?.featureImg) || null
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params
  const locale = getLocaleFromParam(localeParam)
  const page = await getPageData('brands', locale)
  return {
    title: page?.title ? `${page.title} | Algarve Boat Sales` : 'Exclusive Brands | Algarve Boat Sales',
    description: page?.meta_description || 'Authorised Algarve dealer for GRAND, Yamarin, SPX RIB and Vanclaes.',
    alternates: {
      canonical: locale === 'pt' ? 'https://www.algarveboatsales.com/pt/brands' : 'https://www.algarveboatsales.com/brands',
      languages: hreflangAlternates('/brands'),
    },
  }
}

export default async function BrandsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params
  const locale = getLocaleFromParam(localeParam)
  const page = await getPageData('brands', locale)
  const imagesByBrand = getBrandImages()
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
        noImg: true,
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
      description: t('brand_spx_desc'),
      highlight: t('brand_spx_highlight'),
      models: [
        { name: t('brand_spx_m0_name'), href: 'https://www.spxrib.com/spx-24/' },
        { name: t('brand_spx_m1_name'), href: 'https://www.spxrib.com/spx-28/' },
        { name: t('brand_spx_m2_name'), href: 'https://www.spxrib.com/spx-32/' },
        { name: t('brand_spx_m3_name'), href: 'https://www.spxrib.com/spx-38/' },
        { name: t('brand_spx_m4_name'), href: 'https://www.spxrib.com/spx-55/' },
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
      primaryHref: '/trailers',
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
          {BRANDS.map(({ name, short, slug, logo, origin, category, description, models, ranges, feature, highlight, heroImg, website, yamahaPowered, primaryHref }) => (
            <article key={name} id={slug} className={styles.brand}>
              <div className={styles.media}>
                <BrandCarousel images={pickBrandImages(name, heroImg, imagesByBrand)} name={name} fill />
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

                  {feature && (() => {
                    const fImg = pickFeatureImg(name, imagesByBrand)
                    return (
                      <a href={feature.href} target="_blank" rel="noopener noreferrer" className={styles.featureTile}>
                        {fImg && !feature.noImg && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={fImg.src} alt={fImg.alt} className={styles.featureTileImg} aria-hidden="true" />
                        )}
                        <span className={styles.featureBadge}>{t('brands_new_badge')}</span>
                        <span className={styles.featureName}>{feature.name}</span>
                        <span className={styles.featureTagline}>{feature.tagline}</span>
                        <svg className={styles.featureArrow} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6" /></svg>
                      </a>
                    )
                  })()}

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
                  <Link href={localePath(locale, primaryHref || `/boats?make=${slug}`)} className="btn btn-gold">
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
            <Link href={localePath(locale, '/boats')} className="btn btn-gold">{t('brands_browse_all')}</Link>
            <Link href={localePath(locale, '/contact')} className="btn btn-outline-white">{t('brands_request_info')}</Link>
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
