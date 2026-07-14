import Link from 'next/link'
import Image from 'next/image'
import styles from './services.module.css'
import { getLocaleFromParam } from '@/lib/locale'
import { getPageData } from '@/lib/getPage'
import { getTranslations } from '@/lib/translations'
import { PageHero } from '@/components/ui/PageHero'
import { localePath, hreflangAlternates } from '@/lib/localePath'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params
  const locale = getLocaleFromParam(localeParam)
  const page = await getPageData('services', locale)
  return {
    title: page?.title ? `${page.title} | Algarve Boat Sales` : 'Our Services | Algarve Boat Sales',
    description: page?.meta_description || 'Boat sales, maintenance, storage, and trailer services in Lagos, Algarve.',
    alternates: {
      canonical: locale === 'pt' ? 'https://www.algarveboatsales.com/pt/services' : 'https://www.algarveboatsales.com/services',
      languages: hreflangAlternates('/services'),
    },
  }
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params
  const locale = getLocaleFromParam(localeParam)
  const t = getTranslations(locale)

  const SERVICES = [
    {
      title: t('svc0_title'),
      slug: '/boats',
      cta: t('svc0_cta'),
      image: '/services/sales.jpg',
      imageAlt: 'A sleek motorboat moored at a sunny Algarve marina',
      description: t('svc0_desc'),
      features: [t('svc0_f0'), t('svc0_f1'), t('svc0_f2'), t('svc0_f3'), t('svc0_f4'), t('svc0_f5')],
    },
    {
      title: t('svc1_title'),
      slug: 'maintenance',
      image: '/services/maintenance.jpg',
      imageAlt: 'A marine engineer servicing a boat outboard engine',
      description: t('svc1_desc'),
      features: [t('svc1_f0'), t('svc1_f1'), t('svc1_f2'), t('svc1_f3'), t('svc1_f4'), t('svc1_f5')],
    },
    {
      title: t('svc2_title'),
      slug: 'boat-storage',
      image: '/services/storage.jpg',
      imageAlt: 'Boats stored on stands inside a covered indoor storage facility',
      description: t('svc2_desc'),
      features: [t('svc2_f0'), t('svc2_f1'), t('svc2_f2'), t('svc2_f3'), t('svc2_f4'), t('svc2_f5')],
    },
    {
      title: t('svc3_title'),
      slug: '/trailers',
      image: '/services/trailer.jpg',
      imageAlt: 'A stainless steel boat trailer with a RIB loaded on it',
      description: t('svc3_desc'),
      features: [t('svc3_f0'), t('svc3_f1'), t('svc3_f2'), t('svc3_f3')],
    },
    {
      title: t('svc4_title'),
      slug: '#paperwork',
      image: '/services/paperwork.jpg',
      imageAlt: 'Boat registration documents and nautical charts on a desk',
      description: t('svc4_desc'),
      features: [t('svc4_f0'), t('svc4_f1'), t('svc4_f2'), t('svc4_f3')],
    },
  ]

  const [featured, ...rest] = SERVICES

  return (
    <>
      <PageHero
        title={t('services_title')}
        subtitle={t('services_subtitle')}
        imageSrc="/media/20250127_140618-scaled.jpg"
        imageAlt="A GRAND RIB on a trailer inside the Algarve Boat Sales workshop"
      />

      <div className="container">
        <section className={styles.intro}>
          <p>{t('services_intro')}</p>
        </section>

        {/* Featured wide tile breaks up the grid rhythm */}
        <article className={styles.featured} id="sales">
          <div className={styles.featuredMedia}>
            <Image
              src={featured.image}
              alt={featured.imageAlt}
              fill
              sizes="(max-width: 900px) 100vw, 45vw"
              className={styles.mediaImg}
              priority
            />
            <span className={styles.cardIndex}>01</span>
          </div>
          <div className={styles.featuredBody}>
            <span className={styles.eyebrow}>{t('services_eyebrow')}</span>
            <h2 className={styles.featuredTitle}>{featured.title}</h2>
            <p className={styles.desc}>{featured.description}</p>
            <ul className={`${styles.features} ${styles.featuredFeatures}`}>
              {featured.features.map(f => (
                <li key={f}><span className={styles.check}>✓</span>{f}</li>
              ))}
            </ul>
            <div className={styles.featuredActions}>
              <Link href={localePath(locale, featured.slug)} className="btn btn-gold">{featured.cta}</Link>
              <Link href={localePath(locale, '/sell-your-boat')} className="btn btn-outline">{t('services_sell_boat')}</Link>
            </div>
          </div>
        </article>

        <div className={styles.grid}>
          {rest.map(({ title, slug, image, imageAlt, description, features }, i) => (
            <div key={title} className={styles.card} id={slug.replace('/', '')}>
              <div className={styles.media}>
                <Image
                  src={image}
                  alt={imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className={styles.mediaImg}
                />
                <span className={styles.cardIndex}>{String(i + 2).padStart(2, '0')}</span>
                <h2 className={styles.mediaTitle}>{title}</h2>
              </div>
              <div className={styles.body}>
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
                    href={localePath(locale, slug.startsWith('/') ? slug : `/${slug}`)}
                    className={`btn btn-outline ${styles.learnMore}`}
                  >
                    {t('services_learn_more')}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        <section className={styles.cta}>
          <h2>{t('services_cta_title')}</h2>
          <p>{t('services_cta_body')}</p>
          <div className={styles.ctaBtns}>
            <Link href={localePath(locale, '/contact')} className="btn btn-gold">{t('services_contact')}</Link>
            <a href="https://wa.me/351963692451" className="btn btn-outline-white">WhatsApp</a>
          </div>
        </section>
      </div>
    </>
  )
}
