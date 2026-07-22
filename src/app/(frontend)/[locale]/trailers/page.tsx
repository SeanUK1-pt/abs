import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import Image from 'next/image'
import { TrailerFilters } from '@/components/boats/TrailerFilters'
import { PageHero } from '@/components/ui/PageHero'
import styles from './trailers.module.css'
import { getLocaleFromParam } from '@/lib/locale'
import { getTranslations } from '@/lib/translations'
import { localePath, hreflangAlternates } from '@/lib/localePath'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params
  const locale = getLocaleFromParam(localeParam)
  const t = getTranslations(locale)
  return {
    title: t('meta_trailers_title'),
    description: t('meta_trailers_description'),
    alternates: {
      canonical: locale === 'pt' ? 'https://www.algarveboatsales.com/pt/trailers' : 'https://www.algarveboatsales.com/trailers',
      languages: hreflangAlternates('/trailers'),
    },
  }
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-EU', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price)
}

export default async function TrailersPage({
  params: routeParams,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ condition?: string; price_max?: string }>
}) {
  const { locale: localeParam } = await routeParams
  const locale = getLocaleFromParam(localeParam)
  const t = getTranslations(locale)
  const params = await searchParams
  const payload = await getPayload({ config })

  const where: Record<string, any> = { status: { equals: 'available' } }
  if (params.condition) where.condition = { equals: params.condition }
  if (params.price_max) where.price = { less_than_equal: Number(params.price_max) }

  const { docs: trailers, totalDocs } = await payload.find({
    collection: 'trailers',
    where,
    sort: '-createdAt',
    limit: 20,
    depth: 2,
  })

  return (
    <>
      <PageHero
        title={t('trailers_hero_title')}
        subtitle={t('trailers_hero_subtitle')}
        imageSrc="/services/trailer.jpg"
        imageAlt={t('trailers_hero_alt')}
      />

      <section className={styles.configBanner}>
        <div className={`container ${styles.configInner}`}>
          <div className={styles.configText}>
            <span className={styles.configEyebrow}>{t('trailers_promo_eyebrow')}</span>
            <h2 className={styles.configTitle}>{t('trailers_promo_title')}</h2>
            <p className={styles.configLede}>{t('trailers_promo_lede')}</p>
            <div className={styles.configActions}>
              <Link href={localePath(locale, '/trailers/configurator')} className="btn btn-gold">
                {t('trailers_start_configuring')}
              </Link>
              <Link href={localePath(locale, '/contact')} className="btn btn-outline-white">
                {t('trailers_ask_for_advice')}
              </Link>
            </div>
          </div>
          <div className={styles.configMedia}>
            <Image
              src="/services/trailer.jpg"
              alt={t('trailers_promo_img_alt')}
              fill
              className={styles.configImg}
              sizes="(max-width: 900px) 100vw, 420px"
            />
          </div>
        </div>
      </section>

      <div className="container py-8">
        <div className={styles.toolbar}>
          <p className={styles.count}>
            <strong>{totalDocs}</strong> {totalDocs === 1 ? t('trailers_count_singular') : t('trailers_count_plural')}
          </p>
          <TrailerFilters currentCondition={params.condition} currentPriceMax={params.price_max} locale={locale} />
        </div>

        {trailers.length === 0 ? (
          <div className={styles.empty}>
            <p>{t('trailers_empty')}</p>
            <Link href={localePath(locale, '/contact')} className="btn btn-outline">{t('trailers_enquire_about')}</Link>
          </div>
        ) : (
          <div className={styles.grid}>
            {trailers.map((trailer: any) => {
              const img = typeof trailer.main_image === 'object' ? trailer.main_image : null
              return (
                <Link key={trailer.id} href={localePath(locale, `/trailers/${trailer.slug}`)} className={styles.card}>
                  <div className={styles.cardImage}>
                    {img?.url ? (
                      <Image src={img.url} alt={img.alt || trailer.title} fill className={styles.img} sizes="320px" />
                    ) : (
                      <div className={styles.noImg}>No Image</div>
                    )}
                    <span className={`badge badge-${trailer.condition}`}>
                      {trailer.condition === 'new' ? t('condition_new') : t('condition_used')}
                    </span>
                  </div>
                  <div className={styles.cardBody}>
                    <h3 className={styles.cardTitle}>{trailer.title}</h3>
                    <div className={styles.cardSpecs}>
                      {trailer.make && <span>{trailer.make}</span>}
                      {trailer.length_m && <span>{trailer.length_m}m</span>}
                      {trailer.axles && <span>{trailer.axles} axle{trailer.axles > 1 ? 's' : ''}</span>}
                      {trailer.braked && <span>{t('trailers_braked')}</span>}
                    </div>
                    <p className={styles.cardPrice}>{formatPrice(trailer.price)}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        <section className={styles.cta}>
          <h2>{t('trailers_cta_title')}</h2>
          <p>{t('trailers_cta_body')}</p>
          <Link href={localePath(locale, '/contact')} className="btn btn-gold">{t('trailers_enquire_now')}</Link>
        </section>
      </div>
    </>
  )
}
