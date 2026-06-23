import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { BoatCard } from '@/components/boats/BoatCard'
import { QuickSearch } from '@/components/boats/QuickSearch'
import { HeroCarousel } from '@/components/ui/HeroCarousel'
import { BrandLogos } from '@/components/ui/BrandLogos'
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

export default async function HomePage() {
  const locale = await getLocale()
  const t = getTranslations(locale)
  const [featured, latest] = await Promise.all([getFeaturedBoats(locale), getLatestBoats(locale)])

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────── */}
      <section className={styles.hero}>
        <HeroCarousel />
        <div className={`container ${styles.heroContent}`}>
          <h1 className={styles.heroTitle}>
            {t('hero_title')}<br />
            <span className={styles.heroAccent}>{t('hero_subtitle')}</span>
          </h1>
          <p className={styles.heroSub}>{t('hero_body')}</p>
          <div className={styles.heroCtas}>
            <Link href="/boats" className="btn btn-gold">{t('hero_browse')}</Link>
            <Link href="/contact" className="btn btn-outline-white">{t('hero_contact')}</Link>
          </div>
        </div>
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
