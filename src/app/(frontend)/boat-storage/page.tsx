import Link from 'next/link'
import Image from 'next/image'
import styles from './storage.module.css'
import { getLocale } from '@/lib/locale'
import { getPageData } from '@/lib/getPage'
import { RichText } from '@/components/ui/RichText'
import { PageHero } from '@/components/ui/PageHero'
import { BrandLogos } from '@/components/ui/BrandLogos'
import { getTranslations } from '@/lib/translations'

const WINTER_PACKAGE = {
  en: [
    'Recovering the boat to the trailer',
    'Towing to our storage facility',
    'Jet-washing the hull',
    'Cleaning and drying to prepare for storage',
    'Engines prepared for storage by a certified engineer',
    'Storage at our secure facility',
  ],
  pt: [
    'Recolha do barco para o reboque',
    'Transporte para as nossas instalações',
    'Lavagem de alta pressão do casco',
    'Limpeza e secagem para preparação do armazenamento',
    'Motores preparados para armazenamento por engenheiro certificado',
    'Armazenamento nas nossas instalações seguras',
  ],
}

const SPRING_PACKAGE = {
  en: [
    'Engines prepared for service by a certified engineer',
    'Anode replacement (parts excluded)',
    'Deep pre-season cleaning',
    'Polishing and waxing',
    'Transport and launch for service',
  ],
  pt: [
    'Motores preparados para revisão por engenheiro certificado',
    'Substituição de ânodos (peças não incluídas)',
    'Limpeza profunda pré-época',
    'Polimento e enceramento',
    'Transporte e lançamento para revisão',
  ],
}

const WINTER_PRICING = [
  { sizeKey: 'storage_small', range: '< 5.70m / 18ft', rows: [
    { engineKey: 'storage_outboard', m4: '1720€', m5: '1880€', m6: '2035€' },
    { engineKey: 'storage_inboard', m4: '1770€', m5: '1930€', m6: '2080€' },
  ]},
  { sizeKey: 'storage_medium', range: '5.70m – 7.50m / 18–24ft', rows: [
    { engineKey: 'storage_outboard', m4: '1920€', m5: '2120€', m6: '2316€' },
    { engineKey: 'storage_inboard', m4: '1970€', m5: '2170€', m6: '2365€' },
  ]},
  { sizeKey: 'storage_large', range: '> 7.50m / 24ft', rows: [
    { engineKey: 'storage_outboard', m4: '2105€', m5: '2340€', m6: '2570€' },
    { engineKey: 'storage_inboard', m4: '2150€', m5: '2390€', m6: '2620€' },
  ]},
  { sizeKey: 'storage_large_twin', range: '> 7.50m / 24ft', rows: [
    { engineKey: 'storage_outboard', m4: '2205€', m5: '2440€', m6: '2670€' },
    { engineKey: 'storage_inboard', m4: '2300€', m5: '2540€', m6: '2770€' },
  ]},
]

const GENERAL_PRICING = [
  { sizeKey: 'storage_small', range: '< 5.70m / 18ft', indoorMonth: '210€', indoorAnnual: '1997€', outdoorMonth: '160€', outdoorAnnual: '1498€' },
  { sizeKey: 'storage_medium', range: '5.70m – 7.50m / 18–24ft', indoorMonth: '265€', indoorAnnual: '2520€', outdoorMonth: '198€', outdoorAnnual: '1890€' },
  { sizeKey: 'storage_large', range: '> 7.50m / 24ft', indoorMonth: '315€', indoorAnnual: '2995€', outdoorMonth: '240€', outdoorAnnual: '2247€' },
]

const FAQ = {
  en: [
    { q: 'What size boats do you accept?', a: 'We accept boats up to 10 metres / 30 feet in length. Please contact us to discuss larger vessels.' },
    { q: 'Is the facility covered?', a: 'Yes — all boats are stored indoors in our covered, secure facility in the Lagos area.' },
    { q: 'Do I need to bring my own trailer?', a: "We can collect and return your boat on our trailer. You're also welcome to store on your own trailer." },
    { q: 'What does the engine preparation include?', a: 'Our certified engineers flush the cooling system, fog the engine, change the impeller if due, and prepare the engine for inactivity over winter.' },
    { q: 'Can I access my boat during storage?', a: 'Yes, by appointment. Please contact us in advance to arrange access.' },
    { q: 'When should I book?', a: 'We recommend booking before October to guarantee a space. Contact us early to avoid disappointment.' },
  ],
  pt: [
    { q: 'Que tamanho de barcos aceitam?', a: 'Aceitamos barcos até 10 metros de comprimento. Contacte-nos para discutir embarcações maiores.' },
    { q: 'As instalações são cobertas?', a: 'Sim — todos os barcos são armazenados em interior, nas nossas instalações cobertas e seguras na área de Lagos.' },
    { q: 'Preciso de trazer o meu próprio reboque?', a: 'Podemos recolher e devolver o seu barco no nosso reboque. Também pode armazenar no seu próprio reboque.' },
    { q: 'O que inclui a preparação do motor?', a: 'Os nossos engenheiros certificados lavam o sistema de arrefecimento, nebulizam o motor, substituem o impulsor se necessário e preparam o motor para a inatividade invernal.' },
    { q: 'Posso aceder ao meu barco durante o armazenamento?', a: 'Sim, mediante marcação. Contacte-nos com antecedência para organizar o acesso.' },
    { q: 'Quando devo reservar?', a: 'Recomendamos reservar antes de outubro para garantir lugar. Contacte-nos cedo para evitar deceções.' },
  ],
}

export async function generateMetadata() {
  const locale = await getLocale()
  const page = await getPageData('boat-storage', locale)
  const t = getTranslations(locale)
  const title = page?.title ? `${page.title} | Algarve Boat Sales` : `${t('storage_title')} | Algarve Boat Sales`
  const description = page?.meta_description || 'Secure indoor and outdoor boat storage at Marina de Lagos, Algarve. Winter storage packages, spring handback service, and year-round options for boats up to 10m.'
  return {
    title,
    description,
    alternates: { canonical: 'https://www.algarveboatsales.com/boat-storage' },
    openGraph: { title, description, images: ['/media/storage_short_bg_1.jpg'] },
  }
}

export default async function BoatStoragePage() {
  const locale = await getLocale()
  const t = getTranslations(locale)
  const page = await getPageData('boat-storage', locale)
  const winterPkg = WINTER_PACKAGE[locale]
  const springPkg = SPRING_PACKAGE[locale]
  const faq = FAQ[locale]

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
                  {winterPkg.map(item => (
                    <li key={item}><span>✓</span>{item}</li>
                  ))}
                </ul>
              </div>
              <div className={styles.packageCard}>
                <h3 className={styles.packageCardTitle}>{t('storage_spring_pkg')}</h3>
                <ul className={styles.packageList}>
                  {springPkg.map(item => (
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
            <Link href="/maintenance" className="btn btn-primary">{t('storage_promo_cta')}</Link>
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
                    <tr key={`${group.sizeKey}-${row.engineKey}`}>
                      {i === 0 ? (
                        <td rowSpan={2} className={styles.sizeCell}>
                          <strong>{t(group.sizeKey as any)}</strong>
                          <small>{group.range}</small>
                        </td>
                      ) : null}
                      <td>{t(row.engineKey as any)}</td>
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
                  <tr key={row.sizeKey}>
                    <td className={styles.sizeCell}>
                      <strong>{t(row.sizeKey as any)}</strong>
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
            {faq.map(({ q, a }) => (
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
          <Link href="/contact" className="btn btn-gold">{t('storage_cta_btn')}</Link>
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
