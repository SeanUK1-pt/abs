import Link from 'next/link'
import { getLocaleFromParam } from '@/lib/locale'
import { getTranslations } from '@/lib/translations'
import { getSiteSettings } from '@/lib/navigation'
import { localePath, hreflangAlternates } from '@/lib/localePath'
import { PageHero } from '@/components/ui/PageHero'
import styles from '../brands.module.css'

const BASE = 'https://www.algarveboatsales.com'

export const revalidate = 300

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params
  const locale = getLocaleFromParam(localeParam)
  const t = getTranslations(locale)
  return {
    title: t('meta_mastercraft_title'),
    description: t('meta_mastercraft_description'),
    alternates: {
      canonical: locale === 'pt' ? `${BASE}/pt/brands/mastercraft` : `${BASE}/brands/mastercraft`,
      languages: hreflangAlternates('/brands/mastercraft'),
    },
    openGraph: {
      title: t('meta_mastercraft_title'),
      description: t('meta_mastercraft_description'),
      images: [`${BASE}/media/mastercraft-x-hero.webp`],
    },
  }
}

export default async function MastercraftPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params
  const locale = getLocaleFromParam(localeParam)
  const t = getTranslations(locale)
  const siteSettings = await getSiteSettings()

  const families = [
    { name: t('brand_mastercraft_x_name'), blurb: t('brand_mastercraft_x_blurb'), href: 'https://mastercraft.com/boats/x/' },
    { name: t('brand_mastercraft_xt_name'), blurb: t('brand_mastercraft_xt_blurb'), href: 'https://mastercraft.com/boats/xt/' },
    { name: t('brand_mastercraft_nxt_name'), blurb: t('brand_mastercraft_nxt_blurb'), href: 'https://mastercraft.com/boats/nxt/' },
  ]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${BASE}/brands/mastercraft#business`,
    name: siteSettings?.site_name || 'Algarve Boat Sales',
    url: `${BASE}/brands/mastercraft`,
    image: `${BASE}/media/mastercraft-x-hero.webp`,
    telephone: siteSettings?.contact_phone || '+351282045109',
    email: siteSettings?.contact_email || 'info@algarveboatsales.com',
    brand: { '@type': 'Brand', name: 'MasterCraft' },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Marina de Lagos, Loja 11',
      addressLocality: 'Lagos',
      addressRegion: 'Faro',
      postalCode: '8600-780',
      addressCountry: 'PT',
    },
    areaServed: ['Algarve', 'Portugal'],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        title={t('mastercraft_page_h1')}
        subtitle={t('mastercraft_page_subtitle')}
        imageSrc="/media/mastercraft-x-hero.webp"
        imageAlt="A MasterCraft towboat on the water at sunset"
      />

      <div className="container py-8">
        <Link href={localePath(locale, '/brands')} className={styles.backLink}>
          {t('mastercraft_back_to_brands')}
        </Link>

        <article className={`${styles.brand} ${styles.brandDark} ${styles.brandStandalone}`}>
          <div className={styles.body}>
            <div className={styles.brandTop}>
              <span className={styles.logoBox}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/media/mastercraft-logo.png" alt="MasterCraft logo" className={styles.logo} />
              </span>
              <div className={styles.meta}>
                <span className={styles.tag}>Wakesurf / Wakeboard / Ski</span>
                <span className={styles.origin}>USA</span>
              </div>
            </div>

            <p className={styles.desc}>{t('brand_mastercraft_desc')}</p>

            <div className={styles.rangeBlock}>
              <span className={styles.rangeLabel}>{t('brands_model_ranges')}</span>
              <div className={styles.rangeGrid}>
                {families.map((r) => (
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
            </div>

            <div className={styles.actions}>
              <Link href={localePath(locale, '/contact')} className="btn btn-gold">
                {t('brands_enquire_mastercraft')}
              </Link>
              <a href="https://mastercraft.com" target="_blank" rel="noopener noreferrer" className="btn btn-outline-white">
                {t('brands_visit_website')}
              </a>
            </div>
          </div>
        </article>
      </div>
    </>
  )
}
