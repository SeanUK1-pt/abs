import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { BoatCard } from '@/components/boats/BoatCard'
import { FeaturedSpotlight, type SpotlightBoat } from '@/components/boats/FeaturedSpotlight'
import { QuickSearch } from '@/components/boats/QuickSearch'
import { HeroCarousel, type HeroSlide } from '@/components/ui/HeroCarousel'
import { BrandLogos } from '@/components/ui/BrandLogos'
import { UpdateCard } from '@/components/ui/UpdateCard'
import { getLocaleFromParam } from '@/lib/locale'
import { getTranslations } from '@/lib/translations'
import { localePath, hreflangAlternates } from '@/lib/localePath'
import { getSiteSettings } from '@/lib/navigation'
import styles from './home.module.css'

const BASE = 'https://www.algarveboatsales.com'

export const revalidate = 300

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params
  const locale = getLocaleFromParam(localeParam)
  const t = getTranslations(locale)
  const canonical = locale === 'pt' ? `${BASE}/pt` : BASE
  return {
    title: t('meta_home_title'),
    description: t('meta_home_description'),
    alternates: {
      canonical,
      languages: hreflangAlternates(''),
    },
  }
}

function formatPrice(price: number, currency = 'EUR') {
  return new Intl.NumberFormat('en-EU', { style: 'currency', currency, maximumFractionDigits: 0 }).format(price)
}

const makeName = (b: any) => (typeof b.make === 'object' ? b.make?.name : '') || ''

async function getFeaturedBoats(locale: string) {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'boats',
    where: { featured: { equals: true }, status: { equals: 'available' } },
    limit: 6,
    sort: '-createdAt',
    locale: locale as any,
    depth: 2,
  })
  return docs
}

async function getLatestBoats(locale: string) {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'boats',
    where: { status: { equals: 'available' } },
    limit: 3,
    sort: '-createdAt',
    locale: locale as any,
    depth: 2,
  })
  return docs
}

async function getUpdates(locale: string) {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'updates',
    where: { published: { equals: true } },
    limit: 6,
    sort: '-publish_date',
    locale: locale as any,
    depth: 1,
  })
  return docs
}

async function getHeroSlides(locale: string, t: ReturnType<typeof getTranslations>): Promise<HeroSlide[]> {
  const payload = await getPayload({ config })
  const [makesRes, boatsRes] = await Promise.all([
    payload.find({ collection: 'makes', limit: 50, depth: 1, locale: locale as any }),
    payload.find({
      collection: 'boats',
      where: { status: { equals: 'available' } },
      limit: 50,
      sort: '-createdAt',
      locale: locale as any,
      depth: 2,
    }),
  ])
  const makes = makesRes.docs as any[]
  const boats = boatsRes.docs as any[]

  const imageFor = (key: string): string | null => {
    const b = boats.find((x) => makeName(x).toLowerCase().includes(key))
    const img = b && typeof b.main_image === 'object' ? b.main_image : null
    return img?.url || null
  }
  const findMake = (key: string) => makes.find((m) => (m.name || '').toLowerCase().includes(key))

  const HERO_BRANDS: { key: string; label: string; displayTitle: string; msgKey: any; fallbackImg: string; cmsFirst?: boolean; trailers?: boolean; hrefOverride?: string; logoInvert?: boolean }[] = [
    { key: 'grand', label: 'GRAND', displayTitle: t('hero_brand_grand_title'), msgKey: 'hero_brand_grand_msg', fallbackImg: '/media/hero-grand.png' },
    { key: 'mastercraft', label: 'MasterCraft', displayTitle: t('hero_brand_mastercraft_title'), msgKey: 'hero_brand_mastercraft_msg', fallbackImg: '/media/mastercraft-x-hero.webp', hrefOverride: '/brands#mastercraft', logoInvert: true },
    { key: 'spx', label: 'SPX RIB', displayTitle: 'SPX BOATS', msgKey: 'hero_brand_spx_msg', fallbackImg: '/media/hero-spx.png' },
    { key: 'yamarin', label: 'Yamarin', displayTitle: t('hero_brand_yamarin_title'), msgKey: 'hero_brand_yamarin_msg', fallbackImg: '/media/yamarin_hero-scaled.jpg', cmsFirst: true },
    { key: 'vanclaes', label: 'Vanclaes', displayTitle: t('hero_brand_vanclaes_title'), msgKey: 'hero_brand_vanclaes_msg', fallbackImg: '/media/vanclaes-hero.png', trailers: true },
  ]

  const slides: HeroSlide[] = []

  slides.push({
    variant: 'intro',
    src: '/media/general-hero-3.jpg',
    alt: 'A GRAND RIB underway in the Algarve',
    title: t('hero_title'),
    titleAccent: t('hero_subtitle'),
    message: t('hero_body'),
    primaryLabel: t('hero_browse'),
    primaryHref: localePath(locale, '/boats'),
    secondaryLabel: t('hero_contact'),
    secondaryHref: localePath(locale, '/contact'),
  })

  for (const brand of HERO_BRANDS) {
    const mk = findMake(brand.key)
    const logo = mk && typeof mk.logo === 'object' ? mk.logo?.url : null
    const rawHref = brand.hrefOverride || (brand.trailers ? '/trailers' : mk?.slug ? `/boats?make=${mk.slug}` : '/boats')
    slides.push({
      variant: 'brand',
      src: brand.cmsFirst ? (imageFor(brand.key) || brand.fallbackImg) : brand.fallbackImg,
      alt: brand.label,
      logoSrc: logo || null,
      logoInvert: brand.logoInvert,
      title: brand.displayTitle,
      message: t(brand.msgKey),
      primaryLabel: brand.trailers ? t('hero_view_trailers') : t('hero_explore_range'),
      primaryHref: localePath(locale, rawHref),
    })
  }

  slides.push({
    variant: 'brokerage',
    src: '/media/storage_short_bg_1.jpg',
    alt: 'Algarve Boat Sales services',
    eyebrow: t('hero_brokerage_eyebrow'),
    title: t('hero_brokerage_title'),
    message: t('hero_brokerage_msg'),
    primaryLabel: t('hero_brokerage_primary'),
    primaryHref: localePath(locale, '/services'),
    secondaryLabel: t('hero_brokerage_secondary'),
    secondaryHref: localePath(locale, '/sell-your-boat'),
  })

  return slides
}

function toSpotlight(boats: any[]): SpotlightBoat[] {
  return boats.map((b) => {
    const img = typeof b.main_image === 'object' ? b.main_image : null
    return {
      id: b.id,
      slug: b.slug,
      title: b.title,
      make: makeName(b),
      model: typeof b.model === 'object' ? b.model?.name : '',
      year: b.year,
      length_m: b.length_m,
      fuel_type: b.fuel_type,
      location: b.location,
      price: formatPrice(b.sale_price || b.price, b.currency),
      oldPrice: b.sale_price ? formatPrice(b.price, b.currency) : null,
      discountPercent: b.sale_price ? Math.round((1 - b.sale_price / b.price) * 100) : null,
      ivaIncluded: Boolean(b.iva_included),
      condition: b.condition,
      src: img?.url || null,
      alt: img?.alt || b.title,
    }
  })
}

function ServicePillars({ t, locale }: { t: ReturnType<typeof getTranslations>; locale: string }) {
  const pillars = [
    {
      href: localePath(locale, '/sell-your-boat'),
      title: t('pillar_sales_title'),
      body: t('pillar_sales_body'),
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 18 5 9h14l2 9" /><path d="M5 9V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4" /><path d="M2 18h20" /><path d="M12 3v6" /></svg>
      ),
    },
    {
      href: localePath(locale, '/maintenance'),
      title: t('pillar_maintenance_title'),
      body: t('pillar_maintenance_body'),
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.2-.2-2.4z" /></svg>
      ),
    },
    {
      href: localePath(locale, '/boat-storage'),
      title: t('pillar_storage_title'),
      body: t('pillar_storage_body'),
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 21V8l9-5 9 5v13" /><path d="M3 21h18" /><path d="M9 21v-6h6v6" /></svg>
      ),
    },
  ]
  return (
    <div className={styles.pillars}>
      {pillars.map((p) => (
        <Link key={p.href} href={p.href} className={styles.pillar}>
          <span className={styles.pillarIcon}>{p.icon}</span>
          <h3 className={styles.pillarTitle}>{p.title}</h3>
          <p className={styles.pillarBody}>{p.body}</p>
          <span className={styles.pillarLink}>{t('pillars_learn')}</span>
        </Link>
      ))}
    </div>
  )
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params
  const locale = getLocaleFromParam(localeParam)
  const t = getTranslations(locale)
  const [featured, latest, heroSlides, updates, siteSettings] = await Promise.all([
    getFeaturedBoats(locale),
    getLatestBoats(locale),
    getHeroSlides(locale, t),
    getUpdates(locale),
    getSiteSettings(),
  ])
  const spotlight = toSpotlight(featured)

  const sameAs = [
    siteSettings?.facebook_url,
    siteSettings?.instagram_url,
    siteSettings?.youtube_url,
  ].filter(Boolean)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${BASE}/#business`,
    name: siteSettings?.site_name || 'Algarve Boat Sales',
    url: BASE,
    image: `${BASE}/media/general-hero-2.png`,
    telephone: siteSettings?.contact_phone || '+351282045109',
    email: siteSettings?.contact_email || 'info@algarveboatsales.com',
    priceRange: '€€€',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Marina de Lagos, Loja 11',
      addressLocality: 'Lagos',
      postalCode: '8600-780',
      addressRegion: 'Faro',
      addressCountry: 'PT',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 37.1024,
      longitude: -8.6742,
    },
    // Matches the hours shown on /contact (contact_hours_value translation key)
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '17:00',
    },
    areaServed: 'Algarve, Portugal',
    ...(sameAs.length > 0 ? { sameAs } : {}),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <h1 className="sr-only">{t('home_h1')}</h1>

      <section className={styles.hero}>
        <HeroCarousel slides={heroSlides} />
      </section>

      <section className={styles.searchBar}>
        <div className="container">
          <QuickSearch locale={locale} />
        </div>
      </section>

      <section className={styles.showcase}>
        <div className="container">
          <div className={styles.showcaseGrid}>
            {spotlight.length > 0 && (
              <div className={styles.featuredCol}>
                <div className={styles.sectionHead}>
                  <div>
                    <h2 className={styles.sectionTitle}>{t('featured_title')}</h2>
                    <p className={styles.sectionSub}>{t('featured_subtitle')}</p>
                  </div>
                </div>
                <FeaturedSpotlight
                  boats={spotlight}
                  labels={{
                    viewBoat: t('hero_view_boat'),
                    featured: t('hero_featured'),
                    ivaIncl: t('iva_incl'),
                    newLabel: t('condition_new'),
                    usedLabel: t('condition_used'),
                  }}
                />
              </div>
            )}
            <aside className={styles.storyAside}>
              <span className={styles.storyEyebrow}>{t('story_eyebrow')}</span>
              <h2 className={styles.storyTitle}>{t('story_title')}</h2>
              <p className={styles.storyBody}>{t('story_body')}</p>
              <Link href={localePath(locale, '/about')} className="btn btn-gold">{t('story_link')}</Link>
            </aside>
          </div>
          <ServicePillars t={t} locale={locale} />
        </div>
      </section>

      <section className={styles.latestSection}>
        <div className="container">
          <div className={styles.sectionHead}>
            <div>
              <h2 className={styles.sectionTitle}>{t('latest_title')}</h2>
              <p className={styles.sectionSub}>{t('latest_subtitle')}</p>
            </div>
            <Link href={localePath(locale, '/boats')} className="btn btn-outline">{t('view_all_boats')}</Link>
          </div>
          <div className="boats-grid">
            {latest.map((boat: any) => (
              <BoatCard key={boat.id} boat={boat} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      {updates.length > 0 && (
        <section className={styles.newsSection}>
          <div className="container">
            <div className={styles.sectionHead}>
              <div>
                <h2 className={styles.sectionTitle}>{t('news_title')}</h2>
                <p className={styles.sectionSub}>{t('news_subtitle')}</p>
              </div>
            </div>
            <div className={styles.newsGrid}>
              {updates.map((u: any) => (
                <UpdateCard key={u.id} update={u} locale={locale} readMoreLabel={t('news_read_more')} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className={styles.yamaha}>
        <div className="container">
          <div className={styles.yamahaInner}>
            <div className={styles.yamahaMedia}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brands/yamaha-xf450-action.jpg"
                alt="Twin Yamaha XF450 V8 outboard engines powering a boat"
                className={styles.yamahaImg}
              />
            </div>
            <div className={styles.yamahaText}>
              <span className={styles.yamahaEyebrow}>{t('yamaha_eyebrow')}</span>
              <h2 className={styles.yamahaTitle}>{t('yamaha_title')}</h2>
              <p className={styles.yamahaBody}>{t('yamaha_body')}</p>
              <Link href={localePath(locale, '/contact')} className="btn btn-gold">{t('yamaha_cta')}</Link>
              <span className={styles.yamahaLogoBadge}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/brands/yamaha-empowered-by.svg" alt="Empowered by Yamaha" />
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.bottomBrands}>
        <div className="container">
          <BrandLogos
            label={t('brands_label')}
            size="lg"
            logos={[
              { name: 'GRAND Inflatables', file: 'grand-logo.png' },
              { name: 'Yamarin', file: 'yamarin-logo.png' },
              { name: 'SPX RIB', file: 'spx-logo.png' },
              { name: 'Vanclaes', file: 'vanclaes-logo.png' },
            ]}
          />
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaBox}>
            <div>
              <h2>{t('cta_title')}</h2>
              <p>{t('cta_body')}</p>
            </div>
            <div className={styles.ctaBtns}>
              <Link href={localePath(locale, '/contact')} className="btn btn-gold">{t('cta_contact')}</Link>
              <a href="https://wa.me/351963692451" className="btn btn-outline-white">{t('cta_whatsapp')}</a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
