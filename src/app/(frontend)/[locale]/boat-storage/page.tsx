import Link from 'next/link'
import Image from 'next/image'
import styles from './storage.module.css'
import { getLocaleFromParam } from '@/lib/locale'
import { getPageData } from '@/lib/getPage'
import { getTranslations } from '@/lib/translations'
import { RichText } from '@/components/ui/RichText'
import { PageHero } from '@/components/ui/PageHero'
import { BrandLogos } from '@/components/ui/BrandLogos'
import { localePath, hreflangAlternates } from '@/lib/localePath'

const WINTER_PRICING = [
  { size: 'Small', range: '< 5.70m / 18ft', rows: [
    { engine: 'Outboard', m4: '1720€', m5: '1880€', m6: '2035€' },
    { engine: 'Inboard', m4: '1770€', m5: '1930€', m6: '2080€' },
  ]},
  { size: 'Medium', range: '5.70m – 7.50m / 18–24ft', rows: [
    { engine: 'Outboard', m4: '1920€', m5: '2120€', m6: '2316€' },
    { engine: 'Inboard', m4: '1970€', m5: '2170€', m6: '2365€' },
  ]},
  { size: 'Large', range: '> 7.50m / 24ft', rows: [
    { engine: 'Outboard', m4: '2105€', m5: '2340€', m6: '2570€' },
    { engine: 'Inboard', m4: '2150€', m5: '2390€', m6: '2620€' },
  ]},
  { size: 'Large Twin Engine', range: '> 7.50m / 24ft', rows: [
    { engine: 'Outboard', m4: '2205€', m5: '2440€', m6: '2670€' },
    { engine: 'Inboard', m4: '2300€', m5: '2540€', m6: '2770€' },
  ]},
]

const GENERAL_PRICING = [
  { size: 'Small', range: '< 5.70m / 18ft', indoorMonth: '210€', indoorAnnual: '1997€', outdoorMonth: '160€', outdoorAnnual: '1498€' },
  { size: 'Medium', range: '5.70m – 7.50m / 18–24ft', indoorMonth: '265€', indoorAnnual: '2520€', outdoorMonth: '198€', outdoorAnnual: '1890€' },
  { size: 'Large', range: '> 7.50m / 24ft', indoorMonth: '315€', indoorAnnual: '2995€', outdoorMonth: '240€', outdoorAnnual: '2247€' },
]

export const revalidate = 300

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params
  const locale = getLocaleFromParam(localeParam)
  const page = await getPageData('boat-storage', locale)
  const title = page?.title ? `${page.title} | Algarve Boat Sales` : 'Indoor Boat Storage in Lagos | Algarve Boat Sales'
  const description = page?.meta_description || 'Secure indoor and outdoor boat storage at Marina de Lagos, Algarve. Winter storage packages, spring handback service, and year-round options for boats up to 10m.'
  return {
    title,
    description,
    alternates: {
      canonical: locale === 'pt' ? 'https://www.algarveboatsales.com/pt/boat-storage' : 'https://www.algarveboatsales.com/boat-storage',
      languages: hreflangAlternates('/boat-storage'),
    },
    openGraph: {
      title,
      description,
      images: ['/media/storage_short_bg_1.jpg'],
    },
  }
}

export default async function BoatStoragePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params
  const locale = getLocaleFromParam(localeParam)
  const page = await getPageData('boat-storage', locale)
  const t = getTranslations(locale)

  const WINTER_PACKAGE = [
    t('storage_win0'), t('storage_win1'), t('storage_win2'),
    t('storage_win3'), t('storage_win4'), t('storage_win5'),
  ]

  const SPRING_PACKAGE = [
    t('storage_spr0'), t('storage_spr1'), t('storage_spr2'),
    t('storage_spr3'), t('storage_spr4'),
  ]

  const FAQ = [
    { q: t('storage_faq_q0'), a: t('storage_faq_a0') },
    { q: t('storage_faq_q1'), a: t('storage_faq_a1') },
    { q: t('storage_faq_q2'), a: t('storage_faq_a2') },
    { q: t('storage_faq_q3'), a: t('storage_faq_a3') },
    { q: t('storage_faq_q4'), a: t('storage_faq_a4') },
    { q: t('storage_faq_q5'), a: t('storage_faq_a5') },
  ]

  // Size/engine labels translated for pricing table
  const sizeLabels: Record<string, string> = {
    Small: t('storage_small'),
    Medium: t('storage_medium'),
    Large: t('storage_large'),
    'Large Twin Engine': t('storage_large_twin'),
  }
  const engineLabels: Record<string, string> = {
    Outboard: t('storage_outboard'),
    Inboard: t('storage_inboard'),
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Boat Storage',
    provider: {
      '@type': 'LocalBusiness',
      name: 'Algarve Boat Sales',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Marina de Lagos, Loja 11',
        addressLocality: 'Lagos',
        postalCode: '8600-780',
        addressCountry: 'PT',
      },
    },
    areaServed: 'Algarve, Portugal',
    description: 'Indoor and outdoor winter and year-round boat storage for vessels up to 10 metres.',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        title={t('storage_title')}
        subtitle={t('storage_subtitle')}
        imageSrc="/media/storage_short_bg_1.jpg"
        imageAlt="Boats stored on trailers inside Algarve Boat Sales' indoor storage facility"
      />

      <div className="container">
        <section className={styles.intro}>
          <div className={styles.introText}>
            <p className={styles.lead}>{t('storage_lead')}</p>

            <h2>{t('storage_whats_included')}</h2>
            <div className={styles.packageIncludeGrid}>
              <div className={styles.packageCard}>
                <h3 className={styles.packageCardTitle}>{t('storage_winter_pkg')}</h3>
                <ul className={styles.packageList}>
                  {WINTER_PACKAGE.map(item => (
                    <li key={item}><span>✓</span>{item}</li>
                  ))}
                </ul>
              </div>
              <div className={styles.packageCard}>
                <h3 className={styles.packageCardTitle}>{t('storage_spring_pkg')}</h3>
                <ul className={styles.packageList}>
                  {SPRING_PACKAGE.map(item => (
                    <li key={item}><span>✓</span>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <h2>{t('storage_why_title')}</h2>
            <p>{t('storage_why_p1')}</p>
            <p>{t('storage_why_p2')}</p>
            <p className={styles.noteText}>{t('storage_why_note')}</p>
          </div>

          <div className={styles.introPhotos}>
            <div className={styles.introPhoto}>
              <Image
                src="/media/20241119_154607-scaled.jpg"
                alt="Engine bay prepared for storage and service by our certified technicians"
                fill
                sizes="(max-width: 768px) 100vw, 300px"
              />
            </div>
          </div>
        </section>

        {/* Promo strip with CTA */}
        <section className={styles.promoStrip}>
          <Image
            src="/media/storage_short_bg_1.jpg"
            alt="Algarve Boat Sales indoor storage facility"
            fill
            sizes="100vw"
            className={styles.promoStripImg}
          />
          <div className={styles.promoStripCard}>
            <h2>{t('storage_promo_title')}</h2>
            <Link href={localePath(locale, '/maintenance')} className="btn btn-primary">{t('storage_promo_cta')}</Link>
          </div>
        </section>

        <section className={styles.pricing}>
          <h2>{t('storage_winter_table_title')}</h2>
          <p className={styles.pricingNote}>{t('storage_pricing_note1')}</p>
          <div className={styles.tableWrap}>
            <table className={styles.priceTable}>
              <thead>
                <tr>
                  <th>{t('storage_th_size')}</th>
                  <th>{t('storage_th_engine')}</th>
                  <th>{t('storage_th_4m')}</th>
                  <th>{t('storage_th_5m')}</th>
                  <th>{t('storage_th_6m')}</th>
                </tr>
              </thead>
              <tbody>
                {WINTER_PRICING.map(group => (
                  group.rows.map((row, i) => (
                    <tr key={`${group.size}-${row.engine}`}>
                      {i === 0 ? (
                        <td rowSpan={2} className={styles.sizeCell}>
                          <strong>{sizeLabels[group.size] ?? group.size}</strong>
                          <small>{group.range}</small>
                        </td>
                      ) : null}
                      <td>{engineLabels[row.engine] ?? row.engine}</td>
                      <td>{row.m4}</td>
                      <td>{row.m5}</td>
                      <td>{row.m6}</td>
                    </tr>
                  ))
                ))}
              </tbody>
            </table>
          </div>

          <h2 className={styles.secondTableHeading}>{t('storage_general_table_title')}</h2>
          <div className={styles.tableWrap}>
            <table className={styles.priceTable}>
              <thead>
                <tr>
                  <th>{t('storage_th_size')}</th>
                  <th>{t('storage_th_indoor_month')}</th>
                  <th>{t('storage_th_indoor_annual')}</th>
                  <th>{t('storage_th_outdoor_month')}</th>
                  <th>{t('storage_th_outdoor_annual')}</th>
                </tr>
              </thead>
              <tbody>
                {GENERAL_PRICING.map(row => (
                  <tr key={row.size}>
                    <td className={styles.sizeCell}>
                      <strong>{sizeLabels[row.size] ?? row.size}</strong>
                      <small>{row.range}</small>
                    </td>
                    <td>{row.indoorMonth}</td>
                    <td>{row.indoorAnnual}</td>
                    <td>{row.outdoorMonth}</td>
                    <td>{row.outdoorAnnual}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.otherServices}>
            <div><span>{t('storage_trailer_label')}</span><strong>50€</strong></div>
            <div><span>{t('storage_recovery_label')}</span><strong>110€</strong></div>
          </div>
          <p className={styles.pricingNote}>{t('storage_pricing_note2')}</p>
        </section>

        <section className={styles.faq}>
          <h2>{t('storage_faq_title')}</h2>
          <div className={styles.faqGrid}>
            {FAQ.map(({ q, a }) => (
              <div key={q} className={styles.faqItem}>
                <h3>{q}</h3>
                <p>{a}</p>
              </div>
            ))}
          </div>
        </section>

        <BrandLogos
          logos={[
            { name: 'SPX RIB', file: 'spx-logo.png' },
            { name: 'Yamarin', file: 'yamarin-logo.png' },
            { name: 'GRAND Inflatable Boats', file: 'grand-logo.png' },
            { name: 'Vanclaes', file: 'vanclaes-logo.png' },
            { name: 'Blue Marine', file: 'blue-marine-logo.png' },
            { name: 'Salt-Away', file: 'saltaway-logo.png' },
          ]}
        />

        <section className={styles.cta}>
          <h2>{t('storage_cta_title')}</h2>
          <p>{t('storage_cta_body')}</p>
          <Link href={localePath(locale, '/contact')} className="btn btn-gold">{t('storage_cta_btn')}</Link>
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
