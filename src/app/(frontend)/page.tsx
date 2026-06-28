import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { BoatCard } from '@/components/boats/BoatCard'
import { QuickSearch } from '@/components/boats/QuickSearch'
import { HeroCarousel } from '@/components/ui/HeroCarousel'
import { BrandLogos } from '@/components/ui/BrandLogos'
import { UpdateCard } from '@/components/ui/UpdateCard'
import { getLocale } from '@/lib/locale'
import { getTranslations } from '@/lib/translations'
import styles from './home.module.css'

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

function formatPrice(price: number, currency = 'EUR') {
  return new Intl.NumberFormat('en-EU', { style: 'currency', currency, maximumFractionDigits: 0 }).format(price)
}

// Build hero slides from real listings, showcasing the four brands.
async function getHeroSlides(locale: string) {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'boats',
    where: { status: { equals: 'available' } },
    limit: 50,
    sort: '-createdAt',
    locale: locale as any,
    depth: 2,
  })

  const targets: [string, number][] = [
    ['grand', 2],
    ['yamarin', 2],
    ['spx', 2],
    ['vanclaes', 1],
  ]
  const makeName = (b: any) => (typeof b.make === 'object' ? b.make?.name : '') || ''
  const byFeatured = (a: any, b: any) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)

  const picked: any[] = []
  const used = new Set<string | number>()
  for (const [key, n] of targets) {
    const matches = docs
      .filter((b: any) => makeName(b).toLowerCase().includes(key))
      .sort(byFeatured)
      .slice(0, n)
    for (const m of matches) {
      picked.push(m)
      used.add(m.id)
    }
  }
  // Fill from any remaining available boats so the hero is never thin.
  if (picked.length < 4) {
    for (const b of docs) {
      if (used.has(b.id)) continue
      picked.push(b)
      used.add(b.id)
      if (picked.length >= 6) break
    }
  }

  return picked
    .map((b: any) => {
      const img = typeof b.main_image === 'object' ? b.main_image : null
      if (!img?.url) return null
      return {
        src: img.url as string,
        alt: img.alt || b.title,
        brand: makeName(b),
        name: b.title as string,
        price: formatPrice(b.sale_price || b.price, b.currency),
        href: `/boats/${b.slug}`,
        featured: Boolean(b.featured),
      }
    })
    .filter(Boolean) as any[]
}

async function getUpdates(locale: string) {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'updates',
    where: { published: { equals: true } },
    limit: 4,
    sort: '-publish_date',
    locale: locale as any,
    depth: 1,
  })
  return docs
}

export default async function HomePage() {
  const locale = await getLocale()
  const t = getTranslations(locale)
  const [featured, latest, heroSlides, updates] = await Promise.all([
    getFeaturedBoats(locale),
    getLatestBoats(locale),
    getHeroSlides(locale),
    getUpdates(locale),
  ])

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────── */}
      <section className={styles.hero}>
        <HeroCarousel
          headline={{
            title: t('hero_title'),
            subtitle: t('hero_subtitle'),
            body: t('hero_body'),
            browseLabel: t('hero_browse'),
            browseHref: '/boats',
            contactLabel: t('hero_contact'),
            contactHref: '/contact',
            viewLabel: t('hero_view_boat'),
            featuredLabel: t('hero_featured'),
          }}
          slides={heroSlides}
        />
      </section>

      {/* ── Quick Search ──────────────────────────────────── */}
      <section className={styles.searchBar}>
        <div className="container">
          <QuickSearch locale={locale} />
        </div>
      </section>

      {/* ── Brand Logos ───────────────────────────────────── */}
      <section className={styles.brandStrip}>
        <div className="container">
          <p className={styles.brandStripLabel}>{t('brands_label')}</p>
        </div>
        <BrandLogos
          logos={[
            { name: 'GRAND Inflatables', file: 'grand-logo.png' },
            { name: 'Yamarin', file: 'yamarin-logo.png' },
            { name: 'SPX RIB', file: 'spx-logo.png' },
            { name: 'Vanclaes', file: 'vanclaes-logo.png' },
          ]}
        />
      </section>

      {/* ── News & Updates ────────────────────────────────── */}
      {updates.length > 0 && (
        <section className={styles.newsSection}>
          <div className="container">
            <div className="section-header">
              <div>
                <h2 className="section-title">{t('news_title')}</h2>
                <p className="section-subtitle">{t('news_subtitle')}</p>
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

      {/* ── Featured Boats ────────────────────────────────── */}
      {featured.length > 0 && (
        <section className="py-16">
          <div className="container">
            <div className="section-header">
              <div>
                <h2 className="section-title">{t('featured_title')}</h2>
                <p className="section-subtitle">{t('featured_subtitle')}</p>
              </div>
              <Link href="/boats?featured=true" className="btn btn-outline">{t('featured_view_all')}</Link>
            </div>
            <div className="boats-grid">
              {featured.map((boat: any) => (
                <BoatCard key={boat.id} boat={boat} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Latest Listings ───────────────────────────────── */}
      <section className={styles.latestSection}>
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">{t('latest_title')}</h2>
              <p className="section-subtitle">{t('latest_subtitle')}</p>
            </div>
            <Link href="/boats" className="btn btn-outline">{t('view_all_boats')}</Link>
          </div>
          <div className="boats-grid">
            {latest.map((boat: any) => (
              <BoatCard key={boat.id} boat={boat} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaBox}>
            <div>
              <h2>{t('cta_title')}</h2>
              <p>{t('cta_body')}</p>
            </div>
            <div className={styles.ctaBtns}>
              <Link href="/contact" className="btn btn-gold">{t('cta_contact')}</Link>
              <a href="https://wa.me/351963692451" className="btn btn-outline-white">{t('cta_whatsapp')}</a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
