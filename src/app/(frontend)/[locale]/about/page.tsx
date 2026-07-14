import Link from 'next/link'
import styles from './about.module.css'
import { getLocaleFromParam } from '@/lib/locale'
import { getPageData } from '@/lib/getPage'
import { getTranslations } from '@/lib/translations'
import { RichText } from '@/components/ui/RichText'
import { PageHero } from '@/components/ui/PageHero'
import { BrandLogos } from '@/components/ui/BrandLogos'
import { localePath, hreflangAlternates } from '@/lib/localePath'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params
  const locale = getLocaleFromParam(localeParam)
  const page = await getPageData('about', locale)
  return {
    title: page?.title ? `${page.title} | Algarve Boat Sales` : 'About Us | Algarve Boat Sales',
    description: page?.meta_description || 'Learn about Algarve Boat Sales — your premium boat dealer based at Marina de Lagos, Portugal.',
    alternates: {
      canonical: locale === 'pt' ? 'https://www.algarveboatsales.com/pt/about' : 'https://www.algarveboatsales.com/about',
      languages: hreflangAlternates('/about'),
    },
  }
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params
  const locale = getLocaleFromParam(localeParam)
  const page = await getPageData('about', locale)
  const t = getTranslations(locale)

  const services = [
    { title: t('about_svc0_title'), desc: t('about_svc0_desc'), href: localePath(locale, '/boats') },
    { title: t('about_svc1_title'), desc: t('about_svc1_desc'), href: localePath(locale, '/maintenance') },
    { title: t('about_svc2_title'), desc: t('about_svc2_desc'), href: localePath(locale, '/boat-storage') },
    { title: t('about_svc3_title'), desc: t('about_svc3_desc'), href: localePath(locale, '/trailers') },
    { title: t('about_svc4_title'), desc: t('about_svc4_desc'), href: localePath(locale, '/services') },
    { title: t('about_svc5_title'), desc: t('about_svc5_desc'), href: localePath(locale, '/sell-your-boat') },
  ]

  const stats = [
    { num: '15+', label: t('about_stat_experience') },
    { num: '42+', label: t('about_stat_boats') },
    { num: '6',   label: t('about_stat_brands') },
    { num: '3',   label: t('about_stat_countries') },
  ]

  return (
    <>
      <PageHero
        title={t('about_hero_title')}
        subtitle={t('about_hero_subtitle')}
        imageSrc="/media/1-456172121_1068969185231903_5259817831988184865_n.jpg"
        imageAlt="RIB boats cruising near the coast"
      />

      <div className="container">
        <section className={styles.intro}>
          <div className={styles.introText}>
            <h2>{t('about_who_title')}</h2>
            <p>{t('about_who_p1')}</p>
            <p>{t('about_who_p2')}</p>
          </div>
          <div className={styles.introCard}>
            <div className={styles.contactPerson}>
              <div className={styles.personIcon}>MG</div>
              <div>
                <strong>Miguel Gonçalves</strong>
                <span>{t('about_sales_role')}</span>
                <a href="mailto:miguel@algarveboatgroup.com">miguel@algarveboatgroup.com</a>
                <a href="tel:+351963692451">+351 963 692 451</a>
              </div>
            </div>
            <div className={styles.address}>
              <strong>{t('about_find_us')}</strong>
              <p>Marina de Lagos, Loja 11<br />Lagos 8600-780<br />Portugal</p>
              <p className={styles.hint}>{t('about_find_hint')}</p>
            </div>
          </div>
        </section>

        <section className={styles.stats}>
          {stats.map(({ num, label }) => (
            <div key={label} className={styles.stat}>
              <span className={styles.statNum}>{num}</span>
              <span className={styles.statLabel}>{label}</span>
            </div>
          ))}
        </section>

        <section className={styles.services}>
          <h2>{t('about_what_title')}</h2>
          <div className={styles.servicesGrid}>
            {services.map(({ title, desc, href }, i) => (
              <Link key={title} href={href} className={styles.serviceCard}>
                <span className={styles.serviceIndex}>{String(i + 1).padStart(2, '0')}</span>
                <h3>{title}</h3>
                <p>{desc}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.brandsIntro}>
          <h2>{t('about_brands_title')}</h2>
          <p>{t('about_brands_subtitle')}</p>
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
          <Link href={localePath(locale, '/brands')} className="btn btn-outline">{t('about_view_brands')}</Link>
        </p>

        <section className={styles.cta}>
          <h2>{t('about_cta_title')}</h2>
          <div className={styles.ctaBtns}>
            <Link href={localePath(locale, '/boats')} className="btn btn-gold">{t('about_cta_browse')}</Link>
            <Link href={localePath(locale, '/contact')} className="btn btn-outline-white">{t('about_cta_contact')}</Link>
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
