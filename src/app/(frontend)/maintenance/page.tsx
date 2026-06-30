import Link from 'next/link'
import styles from './maintenance.module.css'
import { getLocale } from '@/lib/locale'
import { getPageData } from '@/lib/getPage'
import { RichText } from '@/components/ui/RichText'
import { PageHero } from '@/components/ui/PageHero'

const SERVICES = [
  {
    title: 'Mechanical Services',
    items: ['Engine tune-ups & oil changes', 'Full system diagnostics', 'Seasonal preparation', 'Emergency repairs', 'All major engine brands'],
  },
  {
    title: 'Mechanical Systems Overhaul',
    items: ['Complete engine inspection & repair', 'Inboard & outboard systems', 'Fuel and cooling system work', 'Hydraulics and electrical installs', 'Preventive diagnostic testing'],
  },
  {
    title: 'Hull Repair & Gel Coat Restoration',
    items: ['Gel coat repair & full respray', 'Osmosis treatment', 'Structural hull repairs', 'Polishing & waxing', 'Cosmetic restoration'],
  },
  {
    title: 'Antifouling & Protective Coating',
    items: ['Antifouling application', 'Bottom paint', 'Protective hull coatings', 'Seasonal recoating', 'Performance-focused finishes'],
  },
  {
    title: 'Certifications & Compliance',
    items: ['Documented, certified workmanship', 'Resale-ready paperwork', 'Charter compliance support', 'Regulatory standards met'],
  },
  {
    title: 'Guardenage & Daily Care',
    items: ['Regular checks while in the Marina', 'Routine cleaning on contract', 'Individual deep cleans', 'Wash-down after every outing'],
  },
]

const QUICK_FACTS = [
  'Yamaha & Mercury certified technicians',
  'Based at Marina de Lagos',
  'Genuine parts & documented work',
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
  const locale = await getLocale()
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
        {/* ── Intro split ─────────────────────────────── */}
        <section className={styles.intro}>
          <div className={styles.introText}>
            <span className={styles.eyebrow}>Expert Marine Care</span>
            <h2 className={styles.introTitle}>Expert care for your vessel</h2>
            <p>
              Our daily and seasonal care programmes include cleaning, polishing, mechanical checkups, and
              system testing to help owners maintain their boats in top condition year-round.
            </p>
            <p>
              We have a team that specialises in comprehensive boat renovation — combining craftsmanship,
              advanced technology, and marine expertise to restore and upgrade every aspect of your vessel.
              With years of experience, high-quality materials, and a passion for perfection, we transform
              your vessel into a reliable, beautiful, and seaworthy craft.
            </p>
          </div>

          <aside className={styles.introPanel}>
            <span className={styles.panelIcon} aria-hidden="true">★</span>
            <strong>Certified Engineers</strong>
            <p>Our team includes manufacturer-certified engine technicians for Yamaha and Mercury outboards.</p>
            <ul className={styles.facts}>
              {QUICK_FACTS.map((f) => (
                <li key={f}><span aria-hidden="true">✓</span>{f}</li>
              ))}
            </ul>
          </aside>
        </section>

        {/* ── What we cover ───────────────────────────── */}
        <section className={styles.servicesSection}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>What we cover</h2>
            <p className={styles.sectionSub}>A complete range of servicing, repair, and protection for every part of your boat.</p>
          </div>
          <div className={styles.servicesGrid}>
            {SERVICES.map(({ title, items }, i) => (
              <div key={title} className={styles.serviceCard}>
                <span className={styles.serviceIndex}>{String(i + 1).padStart(2, '0')}</span>
                <h3>{title}</h3>
                <ul>
                  {items.map((item) => (
                    <li key={item}><span aria-hidden="true">✓</span>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ── Seasonal programmes ─────────────────────── */}
        <section className={styles.seasonal}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Seasonal care programmes</h2>
            <p className={styles.sectionSub}>Keep your boat protected through every stage of the year.</p>
          </div>
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

        {/* ── CTA ─────────────────────────────────────── */}
        <section className={styles.cta}>
          <div>
            <h2>Book a service or request a quote</h2>
            <p>Whether it&apos;s a routine annual service or a full renovation project, get in touch and we&apos;ll put together a tailored plan for your boat.</p>
          </div>
          <div className={styles.ctaBtns}>
            <Link href="/contact" className="btn btn-gold">Request a Quote</Link>
            <Link href="/boat-storage" className="btn btn-outline-white">Winter Storage</Link>
          </div>
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
