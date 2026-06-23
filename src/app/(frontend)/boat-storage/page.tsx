import Link from 'next/link'
import Image from 'next/image'
import styles from './storage.module.css'
import { getLocale } from '@/lib/locale'
import { getPageData } from '@/lib/getPage'
import { RichText } from '@/components/ui/RichText'
import { PageHero } from '@/components/ui/PageHero'
import { BrandLogos } from '@/components/ui/BrandLogos'

const WINTER_PACKAGE = [
  'Recovering the boat to the trailer',
  'Towing to our storage facility',
  'Jet-washing the hull',
  'Cleaning and drying to prepare for storage',
  'Engines prepared for storage by a certified engineer',
  'Storage at our secure facility',
]

const SPRING_PACKAGE = [
  'Engines prepared for service by a certified engineer',
  'Anode replacement (parts excluded)',
  'Deep pre-season cleaning',
  'Polishing and waxing',
  'Transport and launch for service',
]

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

export async function generateMetadata() {
  const locale = await getLocale()
  const page = await getPageData('boat-storage', locale)
  const title = page?.title ? `${page.title} | Algarve Boat Sales` : 'Indoor Boat Storage in Lagos | Algarve Boat Sales'
  const description = page?.meta_description || 'Secure indoor and outdoor boat storage at Marina de Lagos, Algarve. Winter storage packages, spring handback service, and year-round options for boats up to 10m.'
  return {
    title,
    description,
    alternates: { canonical: 'https://www.algarveboatsales.com/boat-storage' },
    openGraph: {
      title,
      description,
      images: ['/media/storage_short_bg_1.jpg'],
    },
  }
}

export default async function BoatStoragePage() {
  const locale = await getLocale()
  const page = await getPageData('boat-storage', locale)

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

      {/* Full-bleed photo hero with overlay text — real facility photo, not a flat title bar */}
      <PageHero
        title="Storage Packages"
        subtitle="Secure, covered storage for boats up to 10m — full winter and spring packages included"
        imageSrc="/media/storage_short_bg_1.jpg"
        imageAlt="Boats stored on trailers inside Algarve Boat Sales' indoor storage facility"
      />

      <div className="container">
        <section className={styles.intro}>
          <div className={styles.introText}>
            <p className={styles.lead}>
              We offer complete winter storage packages that include everything you need to put your boat
              away safely for the winter. Available for boats up to 10m/30ft.
            </p>

            <h2>Package Prices Include</h2>
            <div className={styles.packageIncludeGrid}>
              <ul className={styles.packageList}>
                {WINTER_PACKAGE.map(item => (
                  <li key={item}><span>✓</span>{item}</li>
                ))}
              </ul>
              <ul className={styles.packageList}>
                {SPRING_PACKAGE.map(item => (
                  <li key={item}><span>✓</span>{item}</li>
                ))}
              </ul>
            </div>

            <h2>Why Store Your Boat?</h2>
            <p>
              It&rsquo;s simple &ndash; the best way to protect your investment and to keep your boat
              looking good for years to come is to take it away from the harshness of the marine
              environment when it&rsquo;s not in use.
            </p>
            <p>
              During winter in the Algarve, humidity nears 100% on the coast and in the marinas the
              water that&rsquo;s suspended in the air contains the same corrosive salts as the sea.
              This leads to condensation in your boat and can cause extensive damage.
            </p>
            <p className={styles.noteText}>
              Please note, you are not allowed to work on your boat yourself, while the boat is at our
              facility, for insurance reasons.
            </p>
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
            <h2>Give your boat the care it deserves while in storage</h2>
            <Link href="/maintenance" className="btn btn-primary">View Maintenance Services</Link>
          </div>
        </section>

        {/* Pricing — present on the old site, missing entirely from the previous version of this page */}
        <section className={styles.pricing}>
          <h2>Winter Storage Packages</h2>
          <p className={styles.pricingNote}>Prices shown exclude IVA. Packages cover boats stored for 4, 5, or 6 months.</p>
          <div className={styles.tableWrap}>
            <table className={styles.priceTable}>
              <thead>
                <tr>
                  <th>Boat Size</th>
                  <th>Engine</th>
                  <th>4 Months</th>
                  <th>5 Months</th>
                  <th>6 Months</th>
                </tr>
              </thead>
              <tbody>
                {WINTER_PRICING.map(group => (
                  group.rows.map((row, i) => (
                    <tr key={`${group.size}-${row.engine}`}>
                      {i === 0 ? (
                        <td rowSpan={2} className={styles.sizeCell}>
                          <strong>{group.size}</strong>
                          <small>{group.range}</small>
                        </td>
                      ) : null}
                      <td>{row.engine}</td>
                      <td>{row.m4}</td>
                      <td>{row.m5}</td>
                      <td>{row.m6}</td>
                    </tr>
                  ))
                ))}
              </tbody>
            </table>
          </div>

          <h2 className={styles.secondTableHeading}>General Storage Prices</h2>
          <div className={styles.tableWrap}>
            <table className={styles.priceTable}>
              <thead>
                <tr>
                  <th>Boat Size</th>
                  <th>Indoor / Month</th>
                  <th>Indoor / Annual</th>
                  <th>Outdoor / Month</th>
                  <th>Outdoor / Annual</th>
                </tr>
              </thead>
              <tbody>
                {GENERAL_PRICING.map(row => (
                  <tr key={row.size}>
                    <td className={styles.sizeCell}>
                      <strong>{row.size}</strong>
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
            <div><span>Trailer Storage (Month)</span><strong>50€</strong></div>
            <div><span>Recovery / Launch + Transport (Lagos)</span><strong>110€</strong></div>
          </div>
          <p className={styles.pricingNote}>Prices do not include IVA. Not included: fluids, additional work outside the defined package, parts and anodes.</p>
        </section>

        <section className={styles.faq}>
          <h2>Common Questions</h2>
          <div className={styles.faqGrid}>
            {[
              { q: 'What size boats do you accept?', a: 'We accept boats up to 10 metres / 30 feet in length. Please contact us to discuss larger vessels.' },
              { q: 'Is the facility covered?', a: 'Yes — all boats are stored indoors in our covered, secure facility in the Lagos area.' },
              { q: 'Do I need to bring my own trailer?', a: 'We can collect and return your boat on our trailer. You\'re also welcome to store on your own trailer.' },
              { q: 'What does the engine preparation include?', a: 'Our certified engineers flush the cooling system, fog the engine, change the impeller if due, and prepare the engine for inactivity over winter.' },
              { q: 'Can I access my boat during storage?', a: 'Yes, by appointment. Please contact us in advance to arrange access.' },
              { q: 'When should I book?', a: 'We recommend booking before October to guarantee a space. Contact us early to avoid disappointment.' },
            ].map(({ q, a }) => (
              <div key={q} className={styles.faqItem}>
                <h3>{q}</h3>
                <p>{a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Brand strip — individual logo files (wraps gracefully on narrow screens, unlike the old fused banner) */}
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
          <h2>Ready to book winter storage?</h2>
          <p>Contact us for availability and pricing. Spaces are limited — book early.</p>
          <Link href="/contact" className="btn btn-gold">Get a Quote</Link>
        </section>
      </div>

      {/* CMS additional content from Payload Pages editor */}
      {page?.content && (
        <div className="container" style={{ paddingBottom: '3rem' }}>
          <RichText content={page.content} className="richtext-content" />
        </div>
      )}
    </>
  )
}
