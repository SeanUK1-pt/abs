import Link from 'next/link'
import styles from './about.module.css'
import { getLocale } from '@/lib/locale'
import { getPageData } from '@/lib/getPage'
import { RichText } from '@/components/ui/RichText'
import { PageHero } from '@/components/ui/PageHero'
import { BrandLogos } from '@/components/ui/BrandLogos'

export async function generateMetadata() {
  const locale = await getLocale()
  const page = await getPageData('about', locale)
  return {
    title: page?.title ? `${page.title} | Algarve Boat Sales` : 'About Us | Algarve Boat Sales',
    description: page?.meta_description || 'Learn about Algarve Boat Sales — your premium boat dealer based at Marina de Lagos, Portugal.',
  }
}

export default async function AboutPage() {
  const locale = await getLocale()
  const page = await getPageData('about', locale)
  return (
    <>
      {/* Hero */}
      <PageHero
        title="About Algarve Boat Sales"
        subtitle="Your trusted boat dealer in the heart of the Algarve"
        imageSrc="/media/1-456172121_1068969185231903_5259817831988184865_n.jpg"
        imageAlt="RIB boats cruising near the coast"
      />

      <div className="container">
        {/* Intro */}
        <section className={styles.intro}>
          <div className={styles.introText}>
            <h2>Who We Are</h2>
            <p>
              Algarve Boat Sales is a premium boat dealership based at Marina de Lagos, in the heart of the Algarve. We specialise in the sale of new and pre-owned recreational boats, trailers, and marine accessories — bringing together the best brands and the best service under one roof.
            </p>
            <p>
              Our mission is simple: to provide unforgettable maritime experiences. Whether you're buying your first boat, upgrading to something bigger, or selling a vessel you've loved, our skilled and friendly team is here to make the process as straightforward and enjoyable as possible.
            </p>
          </div>
          <div className={styles.introCard}>
            <div className={styles.contactPerson}>
              <div className={styles.personIcon}>MG</div>
              <div>
                <strong>Miguel Gonçalves</strong>
                <span>Sales Director</span>
                <a href="mailto:miguel@algarveboatgroup.com">miguel@algarveboatgroup.com</a>
                <a href="tel:+351963692451">+351 963 692 451</a>
              </div>
            </div>
            <div className={styles.address}>
              <strong>Find Us</strong>
              <p>Marina de Lagos, Loja 11<br />Lagos 8600-780<br />Portugal</p>
              <p className={styles.hint}>Ground floor of Lagos Marina — next to Artesão bar and café.</p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className={styles.stats}>
          {[
            { num: '15+', label: 'Years Experience' },
            { num: '42+', label: 'Boats in Stock' },
            { num: '6', label: 'Exclusive Brands' },
            { num: '3', label: 'Countries Served' },
          ].map(({ num, label }) => (
            <div key={label} className={styles.stat}>
              <span className={styles.statNum}>{num}</span>
              <span className={styles.statLabel}>{label}</span>
            </div>
          ))}
        </section>

        {/* Services grid */}
        <section className={styles.services}>
          <h2>What We Do</h2>
          <div className={styles.servicesGrid}>
            {[
              { title: 'Boat Sales', desc: 'New and pre-owned boats from the world\'s leading manufacturers, competitively priced.', href: '/boats' },
              { title: 'Maintenance & Servicing', desc: 'Certified engine technicians and experienced craftspeople keeping your boat in peak condition.', href: '/maintenance' },
              { title: 'Indoor Storage', desc: 'Secure winter storage packages for boats up to 10m, with full preparation and handback service.', href: '/boat-storage' },
              { title: 'Trailer Supply', desc: 'Quality Vanclaes trailers sized for your boat, with delivery and setup.', href: '/trailers' },
              { title: 'Paperwork Assistance', desc: 'We help with registration, CE certification, and all the maritime documentation you need.', href: '/services' },
              { title: 'Sell Your Boat', desc: 'Get a free valuation and let us find the right buyer for your vessel.', href: '/sell-your-boat' },
            ].map(({ title, desc, href }, i) => (
              <Link key={title} href={href} className={styles.serviceCard}>
                <span className={styles.serviceIndex}>{String(i + 1).padStart(2, '0')}</span>
                <h3>{title}</h3>
                <p>{desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Brands */}
        <section className={styles.brandsIntro}>
          <h2>Our Brands</h2>
          <p>We are the authorised Algarve dealer for some of the world's finest boat manufacturers.</p>
        </section>
      </div>

      <BrandLogos
        logos={[
          { name: 'GRAND Inflatables', file: 'grand-logo.png' },
          { name: 'Yamarin', file: 'yamarin-logo.png' },
          { name: 'SPX RIB', file: 'spx-logo.png' },
          { name: 'Vanclaes', file: 'vanclaes-logo.png' },
        ]}
      />

      <div className="container">
        <p style={{ textAlign: 'center', margin: '-1rem 0 2rem' }}>
          <Link href="/brands" className="btn btn-outline">View All Brands</Link>
        </p>

        {/* CTA */}
        <section className={styles.cta}>
          <h2>Ready to find your perfect boat?</h2>
          <div className={styles.ctaBtns}>
            <Link href="/boats" className="btn btn-gold">Browse Boats</Link>
            <Link href="/contact" className="btn btn-outline-white">Contact Us</Link>
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
