import Link from 'next/link'
import styles from './maintenance.module.css'
import { getLocale } from '@/lib/locale'
import { getPageData } from '@/lib/getPage'
import { RichText } from '@/components/ui/RichText'
import { PageHero } from '@/components/ui/PageHero'



const SERVICES = [
  {
    title: 'Mechanical Services',
    image: '/media/20241119_154607-scaled.jpg',
    items: ['Engine tune-ups & oil changes', 'Full system diagnostics', 'Seasonal preparation', 'Emergency repairs', 'All major engine brands'],
  },
  {
    title: 'Mechanical Systems Overhaul',
    image: null,
    items: ['Complete engine inspection & repair', 'Inboard & outboard systems', 'Fuel and cooling system work', 'Hydraulics and electrical installs', 'Preventive diagnostic testing'],
  },
  {
    title: 'Hull Repair & Gel Coat Restoration',
    image: '/media/20250703_113750-scaled.jpg',
    items: ['Gel coat repair & full respray', 'Osmosis treatment', 'Structural hull repairs', 'Polishing & waxing', 'Cosmetic restoration'],
  },
  {
    title: 'Antifouling & Protective Coating',
    image: null,
    items: ['Antifouling application', 'Bottom paint', 'Protective hull coatings', 'Seasonal recoating', 'Performance-focused finishes'],
  },
  {
    title: 'Certifications & Compliance',
    image: null,
    items: ['Documented, certified workmanship', 'Resale-ready paperwork', 'Charter compliance support', 'Regulatory standards met'],
  },
  {
    title: 'Guardenage & Daily Care',
    image: null,
    items: ['Regular checks while in the Marina', 'Routine cleaning on contract', 'Individual deep cleans', 'Wash-down after every outing'],
  },
]

export async function generateMetadata() {
  const locale = await getLocale()
  const page = await getPageData('maintenance', locale)
  return {
    title: page?.title ? `${page.title} | Algarve Boat Sales` : 'Boat Maintenance | Algarve Boat Sales',
    description: page?.meta_description || 'Professional boat maintenance, servicing and renovation in the Algarve.',
  }
}

export default async function MaintenancePage() {
  const locale = await (await import('@/lib/locale')).getLocale()
  const page = await getPageData('maintenance', locale)

  return (
    <>
      <PageHero
        title="Boat Maintenance"
        subtitle="Nautical care and upkeep — keeping your boat performing at its best"
        imageSrc="/media/20250703_113750-scaled.jpg"
        imageAlt="A boat hull on stands being prepared for restoration work"
      />

      <div className="container">
        <section className={styles.intro}>
          <div>
            <h2>Expert Care for Your Vessel</h2>
            <p>
              Our daily and seasonal care programmes include cleaning, polishing, mechanical checkups, and
              system testing to help owners maintain their boats in top condition year-round.
            </p>
            <p>
              We have a team that specialises in comprehensive boat renovation — combining craftsmanship,
              advanced technology, and marine expertise to restore and upgrade every aspect of your vessel.
              With years of marine experience, high-quality materials, and a passion for perfection, we
              transform your vessel into a reliable, beautiful, and seaworthy craft.
            </p>
          </div>
          <div className={styles.certBadge}>
            <span className={styles.certIcon}>★</span>
            <div>
              <strong>Certified Engineers</strong>
              <p>Our team includes manufacturer-certified engine technicians for Yamaha and Mercury outboards.</p>
            </div>
          </div>
        </section>

        <section className={styles.servicesSection}>
          <h2>What We Cover</h2>
          <div className={styles.servicesGrid}>
            {SERVICES.map(({ title, items }, i) => (
              <div key={title} className={styles.serviceCard}>
                <span className={styles.serviceIndex}>{String(i + 1).padStart(2, '0')}</span>
                <h3>{title}</h3>
                <ul>
                  {items.map(item => (
                    <li key={item}><span>✓</span>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.seasonal}>
          <h2>Seasonal Care Programmes</h2>
          <div className={styles.seasonGrid}>
            <div className={styles.season}>
              <h3>Spring Commissioning</h3>
              <p>Get your boat ready for the season with a full engine service, antifouling, hull polish, and all systems checked before your first trip of the year.</p>
            </div>
            <div className={styles.season}>
              <h3>In-Season Maintenance</h3>
              <p>Regular check-ups, cleaning, and minor repairs throughout the summer to keep your boat in peak condition for every outing.</p>
            </div>
            <div className={styles.season}>
              <h3>Winter Lay-Up</h3>
              <p>Full winterisation of engine and systems, hull cleaning, and secure storage to protect your boat through the off-season.</p>
            </div>
          </div>
        </section>

        <section className={styles.cta}>
          <h2>Book a Service or Request a Quote</h2>
          <p>Whether it's a routine annual service or a full renovation project, get in touch and we'll put together a tailored plan for your boat.</p>
          <div className={styles.ctaBtns}>
            <Link href="/contact" className="btn btn-gold">Request a Quote</Link>
            <Link href="/boat-storage" className="btn btn-outline">Winter Storage</Link>
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
