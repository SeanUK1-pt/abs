import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { BrandCarousel } from '@/components/ui/BrandCarousel'
import styles from './brands.module.css'
import { getLocale } from '@/lib/locale'
import { getPageData } from '@/lib/getPage'
import { RichText } from '@/components/ui/RichText'
import { PageHero } from '@/components/ui/PageHero'

type ModelRange = { name: string; blurb: string; href: string }
type BrandModel = { name: string; href: string }
type Brand = {
  name: string
  short: string
  slug: string
  logo: string
  origin: string
  category: string
  website: string
  heroImg: string | null
  description: string
  highlight: string
  models?: BrandModel[]
  ranges?: ModelRange[]
  feature?: { name: string; tagline: string; href: string }
  yamahaPowered?: boolean
}

const BRANDS: Brand[] = [
  {
    name: 'GRAND Inflatables',
    short: 'GRAND',
    slug: 'grand-inflatables',
    yamahaPowered: true,
    logo: '/media/grand-logo.png',
    origin: 'Ukraine',
    category: 'RIB / Inflatable',
    website: 'https://grandboats.com',
    heroImg: '/media/hero-grand.png',
    description:
      'GRAND is a rigid inflatable boat manufacturer specialising in high-end fibreglass RIBs. Founded in 2001 by a group of passionate engineers and sailing enthusiasts, GRAND boats are developed, designed, and built in Ukraine — ensuring every boat is a true European product. Through a global distribution network, they offer a wide range of high-end family RIBs, yacht tenders, and commercial RIBs, crafted to deliver a fusion of luxury and functionality.',
    highlight: 'Premium fibreglass RIBs with superior build quality',
    feature: {
      name: 'GRAND G980',
      tagline: 'The flagship Golden Line RIB — luxury, power and European craftsmanship at its peak.',
      href: 'https://grandboats.com/en/golden-line/23-golden-line-g980.html',
    },
    ranges: [
      { name: 'Golden Line', blurb: 'Flagship premium RIBs — luxury, comfort and refined design.', href: 'https://grandboats.com/en/golden-line-3' },
      { name: 'Silver Line', blurb: 'Versatile family RIBs balancing quality, space and value.', href: 'https://grandboats.com/en/silver-line-4' },
      { name: 'Drive Line', blurb: 'High-performance commercial and work-ready RIBs.', href: 'https://grandboats.com/en/drive-line-5' },
    ],
  },
  {
    name: 'Yamarin',
    short: 'Yamarin',
    slug: 'yamarin',
    yamahaPowered: true,
    logo: '/media/yamarin-logo.png',
    origin: 'Finland',
    category: 'Bowrider / Day Cruiser',
    website: 'https://yamarin.com',
    heroImg: '/media/yamarin_hero-scaled.jpg',
    description:
      'Yamarin has been building high-quality leisure boats in Finland since 1969. Known for their exceptional seakeeping, Yamarin boats combine Scandinavian design with outstanding durability. The range covers everything from nimble bowriders to spacious day cruisers and cabin boats, all engineered for the demanding waters of northern Europe — and the Algarve.',
    highlight: 'Finnish-built quality since 1969',
    feature: {
      name: 'Yamarin Aura',
      tagline: 'The all-new flagship — Scandinavian design at its finest.',
      href: 'https://yamarin.com/fi/yamarin-aura-cabin',
    },
    ranges: [
      { name: 'Day Cruiser', blurb: 'Spacious cruisers built for long, comfortable days afloat.', href: 'https://yamarin.com/fi/day-cruiser-retkiveneet' },
      { name: 'Bow Rider', blurb: 'Agile, sporty open boats — perfect for family fun.', href: 'https://yamarin.com/en/mallisto' },
      { name: 'Console', blurb: 'Practical console boats for fishing and exploring.', href: 'https://yamarin.com/en/mallisto' },
    ],
  },
  {
    name: 'SPX RIB',
    short: 'SPX RIB',
    slug: 'spx-rib',
    yamahaPowered: true,
    logo: '/media/spx-logo.png',
    origin: 'Italy (Sicily)',
    category: 'Luxury RIB',
    website: 'https://www.spxrib.com',
    heroImg: '/media/hero-spx.png',
    description:
      "SPX RIB is a brand from Sicily, Italy, that has completely redesigned the deck space of rigid inflatables — moving from a utilitarian look to Italian chic, packed with features. Algarve Boat Sales is the authorised Portuguese dealer, and we're proud to bring SPX RIB to the Algarve. SPX already enjoys great success globally, having made waves at its debut at the Miami International Boat Show.",
    models: [
      { name: 'SPX 24 (7.5m)', href: 'https://www.spxrib.com/spx-24/' },
      { name: 'SPX 32 (9.7m)', href: 'https://www.spxrib.com/spx-32/' },
      { name: 'SPX 38 (11.5m)', href: 'https://www.spxrib.com/spx-38/' },
    ],
    highlight: 'Italian design meets serious performance',
  },
  {
    name: 'Vanclaes',
    short: 'Vanclaes',
    slug: 'vanclaes',
    logo: '/media/vanclaes-logo.png',
    origin: 'Netherlands',
    category: 'Boat Trailers',
    website: 'https://vanclaes.com',
    heroImg: '/media/brands-vanclaes.png',
    description:
      "Vanclaes is one of Europe's leading manufacturers of high-quality boat trailers. Built from marine-grade stainless steel, Vanclaes trailers are designed for longevity and ease of use, with hot-dip galvanised options available. From compact single-axle trailers for small RIBs to heavy-duty multi-axle trailers for large cabin boats, Vanclaes has a solution for every vessel.",
    models: [
      { name: 'Rib Marine Wave 1350', href: 'https://vanclaes.com/rib-marine-wave-1350-13-550-geremd-1-as/p-2110.html' },
      { name: 'Rib Marine Wave 1800', href: 'https://vanclaes.com/rib-marine-wave-1800-14-600-geremd-1-as/p-1646.html' },
      { name: 'Rib Marine Wave 2750', href: 'https://vanclaes.com/rib-marine-wave-2750-13-650-geremd-2-as/p-2145.html' },
    ],
    highlight: "Europe's premier stainless steel trailer manufacturer",
  },
]

const BRAND_KEYS = ['grand', 'yamarin', 'spx', 'vanclaes']

async function getBrandImages(locale: string): Promise<Record<string, { src: string; alt: string }[]>> {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'boats',
    where: { status: { equals: 'available' } },
    limit: 80,
    sort: '-createdAt',
    locale: locale as any,
    depth: 2,
  })

  const map: Record<string, { src: string; alt: string }[]> = {}
  for (const b of docs as any[]) {
    const makeName = (typeof b.make === 'object' ? b.make?.name : '') || ''
    const key = BRAND_KEYS.find((k) => makeName.toLowerCase().includes(k))
    if (!key) continue
    const bucket = (map[key] ||= [])
    const candidates: any[] = [
      typeof b.main_image === 'object' ? b.main_image : null,
      ...(Array.isArray(b.gallery)
        ? b.gallery.map((g: any) => (typeof g?.image === 'object' ? g.image : null))
        : []),
    ]
    for (const img of candidates) {
      if (bucket.length >= 6) break
      if (img?.url && !bucket.some((x) => x.src === img.url)) {
        bucket.push({ src: img.url, alt: img.alt || b.title })
      }
    }
  }
  return map
}

function pickBrandImages(
  name: string,
  heroImg: string | null,
  map: Record<string, { src: string; alt: string }[]>,
) {
  const key = BRAND_KEYS.find((k) => name.toLowerCase().includes(k))
  const real = (key && map[key]) || []
  if (real.length > 0) return real
  return heroImg ? [{ src: heroImg, alt: name }] : []
}

export async function generateMetadata() {
  const locale = await getLocale()
  const page = await getPageData('brands', locale)
  return {
    title: page?.title ? `${page.title} | Algarve Boat Sales` : 'Exclusive Brands | Algarve Boat Sales',
    description: page?.meta_description || 'Authorised Algarve dealer for GRAND, Yamarin, SPX RIB and Vanclaes.',
  }
}

export default async function BrandsPage() {
  const locale = await getLocale()
  const page = await getPageData('brands', locale)
  const imagesByBrand = await getBrandImages(locale)

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
            dealer for each brand, we offer factory-direct ordering, warranty support, and genuine parts.
          </p>
        </section>

        <div className={styles.brands}>
          {BRANDS.map(({ name, short, slug, logo, origin, category, description, models, ranges, feature, highlight, heroImg, website, yamahaPowered }) => (
            <article key={name} id={slug} className={styles.brand}>
              <div className={styles.media}>
                <BrandCarousel images={pickBrandImages(name, heroImg, imagesByBrand)} name={name} fill />
                {yamahaPowered && (
                  <span className={styles.yamahaBadge}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/brands/yamaha-empowered-by.svg" alt="Empowered by Yamaha" />
                  </span>
                )}
              </div>

              <div className={styles.body}>
                <div className={styles.brandTop}>
                  {logo && (
                    <span className={styles.logoBox}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={logo} alt={`${name} logo`} className={styles.logo} />
                    </span>
                  )}
                  <div className={styles.meta}>
                    <span className={styles.tag}>{category}</span>
                    <span className={styles.origin}>{origin}</span>
                  </div>
                </div>

                <h2 className={styles.name}>{name}</h2>
                <p className={styles.highlight}>{highlight}</p>
                <p className={styles.desc}>{description}</p>

                <div className={styles.rangeBlock}>
                  <span className={styles.rangeLabel}>{ranges ? 'Model ranges' : 'Model range'}</span>

                  {feature && (
                    <a href={feature.href} target="_blank" rel="noopener noreferrer" className={styles.featureTile}>
                      <span className={styles.featureBadge}>New</span>
                      <span className={styles.featureName}>{feature.name}</span>
                      <span className={styles.featureTagline}>{feature.tagline}</span>
                      <svg className={styles.featureArrow} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6" /></svg>
                    </a>
                  )}

                  {ranges ? (
                    <div className={styles.rangeGrid}>
                      {ranges.map((r) => (
                        <a key={r.name} href={r.href} target="_blank" rel="noopener noreferrer" className={styles.rangeTile}>
                          <span className={styles.rangeName}>{r.name}</span>
                          <span className={styles.rangeBlurb}>{r.blurb}</span>
                          <span className={styles.rangeMore}>
                            View range
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6" /></svg>
                          </span>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className={styles.modelGrid}>
                      {models?.map((m) => (
                        <a key={m.name} href={m.href} target="_blank" rel="noopener noreferrer" className={styles.modelPanel}>
                          <span>{m.name}</span>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6" /></svg>
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                <div className={styles.actions}>
                  <Link href={`/boats?make=${slug}`} className="btn btn-gold">
                    View Used {short} Boats
                  </Link>
                  {website && (
                    <a href={website} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                      Visit Website
                    </a>
                  )}
                </div>
              </div>
            </article>
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

      {page?.content && (
        <div className="container" style={{ paddingBottom: '3rem' }}>
          <RichText content={page.content} className="richtext-content" />
        </div>
      )}
    </>
  )
}
