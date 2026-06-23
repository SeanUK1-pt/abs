import Link from 'next/link'
import styles from './services.module.css'
import { getLocale } from '@/lib/locale'
import { getPageData } from '@/lib/getPage'
import { RichText } from '@/components/ui/RichText'
import { PageHero } from '@/components/ui/PageHero'



const SERVICES = [
  {
    title: 'Boat Sales & Brokerage',
    slug: '#sales',
    description: 'We offer an extensive range of new and pre-owned boats from the world\'s leading manufacturers. Our team will guide you through the entire purchase process — from first viewing to sea trial, registration, and handover.',
    features: ['New boat orders direct from factory', 'Pre-owned boat inspections', 'Part-exchange welcome', 'Sea trials arranged', 'Registration assistance'],
  },
  {
    title: 'Maintenance & Servicing',
    slug: 'maintenance',
    description: 'Our certified engineers and experienced craftspeople provide comprehensive maintenance programmes to keep your boat performing at its best, season after season.',
    features: ['Annual engine servicing', 'Anode replacement', 'Hull cleaning & antifouling', 'Gel coat repair', 'Electrical systems', 'Full pre-season preparation'],
  },
  {
    title: 'Indoor Boat Storage',
    slug: 'boat-storage',
    description: 'Secure, covered storage for boats up to 10m/30ft. Our winter storage packages include full preparation on the way in and a thorough pre-season handback service.',
    features: ['Jet-wash on arrival', 'Engine winterisation by certified engineer', 'Secure covered facility', 'Pre-season cleaning & polish', 'Anode check & replacement', 'Delivery & collection available'],
  },
  {
    title: 'Trailer Supply',
    slug: '/trailers',
    description: 'We supply and fit Vanclaes branded trailers — one of Europe\'s leading trailer manufacturers — sized precisely for your vessel.',
    features: ['Stainless steel construction', 'Braked and un-braked options', 'IVA registration assistance', 'Delivery throughout Portugal'],
  },
  {
    title: 'Paperwork & Licensing',
    slug: '#paperwork',
    description: 'Navigating Portuguese maritime bureaucracy can be complex. We help you with everything from vessel registration and CE certification to licence requirements.',
    features: ['Vessel registration (DGRM)', 'CE category documentation', 'Import / customs assistance', 'Insurance referrals'],
  },
  {
    title: 'Sell Your Boat',
    slug: 'sell-your-boat',
    description: 'Looking to sell? We offer free, no-obligation valuations and a hassle-free brokerage service. We handle viewings, sea trials and negotiations on your behalf.',
    features: ['Free valuation within 48 hours', 'Professional photography', 'Listing on our website', 'Viewings & sea trials managed', 'Secure payment handling'],
  },
]

export async function generateMetadata() {
  const locale = await getLocale()
  const page = await getPageData('services', locale)
  return {
    title: page?.title ? `${page.title} | Algarve Boat Sales` : 'Our Services | Algarve Boat Sales',
    description: page?.meta_description || 'Boat sales, maintenance, storage, and trailer services in Lagos, Algarve.',
  }
}

export default async function ServicesPage() {
  const locale = await (await import('@/lib/locale')).getLocale()
  const page = await getPageData('services', locale)

  return (
    <>
      <PageHero
        title="Our Services"
        subtitle="Everything you need — from buying your first boat to keeping it in perfect condition"
        imageSrc="/media/20250127_140618-scaled.jpg"
        imageAlt="A GRAND RIB on a trailer inside the Algarve Boat Sales workshop"
      />

      <div className="container">
        <section className={styles.intro}>
          <p>
            Welcome to Algarve Boat Sales. Our mission is to provide unforgettable maritime experiences.
            Whether you're buying or selling a boat, needing an engine service, help navigating paperwork,
            or finding the best accessories — we have you covered. Our skilled and friendly crew provide
            practical, hassle-free solutions so you can spend your time out on the water.
          </p>
        </section>

        <div className={styles.grid}>
          {SERVICES.map(({ title, slug, description, features }, i) => (
            <div key={title} className={styles.card} id={slug.replace('/', '')}>
              <div className={styles.cardHeader}>
                <span className={styles.cardIndex}>{String(i + 1).padStart(2, '0')}</span>
                <h2>{title}</h2>
              </div>
              <p className={styles.desc}>{description}</p>
              <ul className={styles.features}>
                {features.map(f => (
                  <li key={f}>
                    <span className={styles.check}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              {slug && !slug.startsWith('#') && (
                <Link
                  href={slug.startsWith('/') ? slug : `/${slug}`}
                  className={`btn btn-outline ${styles.learnMore}`}
                >
                  Learn More
                </Link>
              )}
            </div>
          ))}
        </div>

        <section className={styles.cta}>
          <h2>Have a question about any of our services?</h2>
          <p>Our team is happy to help — get in touch and we'll respond within a few hours.</p>
          <div className={styles.ctaBtns}>
            <Link href="/contact" className="btn btn-gold">Contact Us</Link>
            <a href="https://wa.me/351963692451" className="btn btn-outline-white">WhatsApp</a>
          </div>
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
