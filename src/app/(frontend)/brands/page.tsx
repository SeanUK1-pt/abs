import Link from 'next/link'
import Image from 'next/image'
import styles from './brands.module.css'
import { getLocale } from '@/lib/locale'
import { getPageData } from '@/lib/getPage'
import { RichText } from '@/components/ui/RichText'
import { PageHero } from '@/components/ui/PageHero'



const BRANDS = [
  {
    name: 'GRAND Inflatables',
    origin: 'Ukraine',
    category: 'RIB / Inflatable',
    website: 'https://grandboats.com',
    heroImg: '/media/screenshot-31.png',
    description: 'GRAND is a rigid inflatable boat manufacturer specialising in high-end fibreglass RIBs. Founded in 2001 by a group of passionate engineers and sailing enthusiasts, GRAND boats are developed, designed, and built in Ukraine — ensuring every boat is a true European product. Through a global distribution network, they offer a wide range of high-end family RIBs, yacht tenders, and commercial RIBs, crafted to deliver a fusion of luxury and functionality.',
    models: ['Golden Line 650', 'Golden Line 680', 'Golden Line 750', 'Golden Line 850', 'Silverline 300', 'Silverline 330'],
    highlight: 'Premium fibreglass RIBs with superior build quality',
  },
  {
    name: 'Yamarin',
    origin: 'Finland',
    category: 'Bowrider / Day Cruiser',
    website: 'https://yamarin.com',
    heroImg: '/media/yamarin_hero-scaled.jpg',
    description: 'Yamarin has been building high-quality leisure boats in Finland since 1969. Known for their exceptional seakeeping, Yamarin boats combine Scandinavian design with outstanding durability. The range covers everything from nimble bowriders to spacious day cruisers and cabin boats, all engineered for the demanding waters of northern Europe — and the Algarve.',
    models: ['Yamarin 63 BR', 'Yamarin 67 DC', 'Yamarin 80 DC', 'Yamarin 88 DC Premium'],
    highlight: 'Finnish-built quality since 1969',
  },
  {
    name: 'SPX RIB',
    origin: 'Italy (Sicily)',
    category: 'Luxury RIB',
    website: 'https://www.spxrib.com',
    heroImg: '/media/SPX_main_hero-scaled.jpg',
    description: 'SPX RIB is a brand from Sicily, Italy, that has completely redesigned the deck space of rigid inflatables — moving from a utilitarian look to Italian chic, packed with features. Algarve Boat Sales is the authorised Portuguese dealer, and we\'re proud to bring SPX RIB to the Algarve. SPX already enjoys great success globally, having made waves at its debut at the Miami International Boat Show.',
    models: ['SPX 24 (7.5m)', 'SPX 32 (9.7m)', 'SPX 38 (11.5m)'],
    highlight: 'Italian design meets serious performance',
  },
  {
    name: 'Vanclaes',
    origin: 'Netherlands',
    category: 'Boat Trailers',
    website: 'https://vanclaes.com',
    heroImg: null,
    description: 'Vanclaes is one of Europe\'s leading manufacturers of high-quality boat trailers. Built from marine-grade stainless steel, Vanclaes trailers are designed for longevity and ease of use, with hot-dip galvanised options available. From compact single-axle trailers for small RIBs to heavy-duty multi-axle trailers for large cabin boats, Vanclaes has a solution for every vessel.',
    models: ['Rib Marine Wave 1350', 'Rib Marine Wave 1800', 'Rib Marine Wave 2750'],
    highlight: 'Europe\'s premier stainless steel trailer manufacturer',
  },
]

export async function generateMetadata() {
  const locale = await getLocale()
  const page = await getPageData('brands', locale)
  return {
    title: page?.title ? `${page.title} | Algarve Boat Sales` : 'Exclusive Brands | Algarve Boat Sales',
    description: page?.meta_description || 'Authorised Algarve dealer for GRAND, Yamarin, SPX RIB and Vanclaes.',
  }
}

export default async function BrandsPage() {
  const locale = await (await import('@/lib/locale')).getLocale()
  const page = await getPageData('brands', locale)

  return (
    <>
      <PageHero
        title="Exclusive Brands"
        subtitle="Authorised dealer for the world's finest boat manufacturers"
        imageSrc="/media/SPX_main_hero-1-scaled.jpg"
        imageAlt="An SPX RIB underway near the coast"
      />

      <div className="container">
        <section className={styles.intro}>
          <p>
            We handpick the brands we represent — every manufacturer in our portfolio has been chosen for
            their commitment to quality, innovation, and after-sales support. As the authorised Algarve
            dealer for each brand, we can offer factory-direct ordering, warranty support, and genuine parts.
          </p>
        </section>

        <div className={styles.brands}>
          {BRANDS.map(({ name, origin, category, description, models, highlight, heroImg, website }) => (
            <div key={name} className={styles.brand}>
              {heroImg ? (
                <div className={styles.brandImg}>
                  <Image src={heroImg} alt={name} fill className={styles.brandImgEl} sizes="(max-width: 900px) 100vw, 1200px" />
                  <div className={styles.brandImgOverlay} />
                </div>
              ) : (
                <div className={styles.brandImgPending} data-pending-asset={`${name.toLowerCase().replace(/\s+/g, '-')}-hero.jpg`}>
                  Photo coming soon
                </div>
              )}
              <div className={styles.brandHeader}>
                <div>
                  <h2>{name}</h2>
                  <div className={styles.brandMeta}>
                    <span className={styles.tag}>{category}</span>
                    <span className={styles.origin}>{origin}</span>
                  </div>
                </div>
              </div>
              <p className={styles.highlight}>{highlight}</p>
              <p className={styles.desc}>{description}</p>
              <div className={styles.models}>
                <strong>Models available:</strong>
                <div className={styles.modelList}>
                  {models.map(m => <span key={m} className={styles.modelChip}>{m}</span>)}
                </div>
              </div>
              <div className={styles.brandActions}>
                <Link
                  href={`/boats?make=${name.toLowerCase().replace(/\s+/g, '-')}`}
                  className={styles.viewListingsBtn}
                >
                  View {name} Listings →
                </Link>
                {website && (
                  <a
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.visitSiteBtn}
                  >
                    Visit {name} Website ↗
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        <section className={styles.cta}>
          <h2>Interested in a specific brand?</h2>
          <p>Contact us for pricing, availability, and to arrange a viewing or sea trial.</p>
          <div className={styles.ctaBtns}>
            <Link href="/boats" className="btn btn-gold">Browse All Boats</Link>
            <Link href="/contact" className="btn btn-outline-white">Request Info</Link>
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
