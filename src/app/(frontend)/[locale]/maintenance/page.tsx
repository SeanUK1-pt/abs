import Link from 'next/link'
import styles from './maintenance.module.css'
import { getLocaleFromParam } from '@/lib/locale'
import { getPageData } from '@/lib/getPage'
import { getTranslations } from '@/lib/translations'
import { RichText } from '@/components/ui/RichText'
import { PageHero } from '@/components/ui/PageHero'
import { localePath, hreflangAlternates } from '@/lib/localePath'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params
  const locale = getLocaleFromParam(localeParam)
  const page = await getPageData('maintenance', locale)
  return {
    title: page?.title ? `${page.title} | Algarve Boat Sales` : 'Boat Maintenance | Algarve Boat Sales',
    description: page?.meta_description || 'Professional boat maintenance, servicing and renovation in the Algarve.',
    alternates: {
      canonical: locale === 'pt' ? 'https://www.algarveboatsales.com/pt/maintenance' : 'https://www.algarveboatsales.com/maintenance',
      languages: hreflangAlternates('/maintenance'),
    },
  }
}

export default async function MaintenancePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params
  const locale = getLocaleFromParam(localeParam)
  const page = await getPageData('maintenance', locale)
  const t = getTranslations(locale)

  const SERVICES = [
    { title: t('maint_svc0_title'), items: [t('maint_svc0_i0'), t('maint_svc0_i1'), t('maint_svc0_i2'), t('maint_svc0_i3'), t('maint_svc0_i4')] },
    { title: t('maint_svc1_title'), items: [t('maint_svc1_i0'), t('maint_svc1_i1'), t('maint_svc1_i2'), t('maint_svc1_i3'), t('maint_svc1_i4')] },
    { title: t('maint_svc2_title'), items: [t('maint_svc2_i0'), t('maint_svc2_i1'), t('maint_svc2_i2'), t('maint_svc2_i3'), t('maint_svc2_i4')] },
    { title: t('maint_svc3_title'), items: [t('maint_svc3_i0'), t('maint_svc3_i1'), t('maint_svc3_i2'), t('maint_svc3_i3'), t('maint_svc3_i4')] },
    { title: t('maint_svc4_title'), items: [t('maint_svc4_i0'), t('maint_svc4_i1'), t('maint_svc4_i2'), t('maint_svc4_i3')] },
    { title: t('maint_svc5_title'), items: [t('maint_svc5_i0'), t('maint_svc5_i1'), t('maint_svc5_i2'), t('maint_svc5_i3')] },
  ]

  const QUICK_FACTS = [t('maint_fact0'), t('maint_fact1'), t('maint_fact2')]

  return (
    <>
      <PageHero
        title={t('maint_title')}
        subtitle={t('maint_subtitle')}
        imageSrc="/media/20250703_113750-scaled.jpg"
        imageAlt="A boat hull on stands being prepared for restoration work"
      />

      <div className="container">
        {/* ── Intro split ─────────────────────────────── */}
        <section className={styles.intro}>
          <div className={styles.introText}>
            <span className={styles.eyebrow}>{t('maint_eyebrow')}</span>
            <h2 className={styles.introTitle}>{t('maint_intro_title')}</h2>
            <p>{t('maint_intro_p1')}</p>
            <p>{t('maint_intro_p2')}</p>
          </div>

          <aside className={styles.introPanel}>
            <span className={styles.panelIcon} aria-hidden="true">★</span>
            <strong>{t('maint_panel_title')}</strong>
            <p>{t('maint_panel_body')}</p>
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
            <h2 className={styles.sectionTitle}>{t('maint_what_title')}</h2>
            <p className={styles.sectionSub}>{t('maint_what_sub')}</p>
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
            <h2 className={styles.sectionTitle}>{t('maint_seasonal_title')}</h2>
            <p className={styles.sectionSub}>{t('maint_seasonal_sub')}</p>
          </div>
          <div className={styles.seasonGrid}>
            <div className={styles.season}>
              <h3>{t('maint_spring_title')}</h3>
              <p>{t('maint_spring_body')}</p>
            </div>
            <div className={styles.season}>
              <h3>{t('maint_inseason_title')}</h3>
              <p>{t('maint_inseason_body')}</p>
            </div>
            <div className={styles.season}>
              <h3>{t('maint_winter_title')}</h3>
              <p>{t('maint_winter_body')}</p>
            </div>
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────── */}
        <section className={styles.cta}>
          <div>
            <h2>{t('maint_cta_title')}</h2>
            <p>{t('maint_cta_body')}</p>
          </div>
          <div className={styles.ctaBtns}>
            <Link href={localePath(locale, '/contact')} className="btn btn-gold">{t('maint_cta_btn')}</Link>
            <Link href={localePath(locale, '/boat-storage')} className="btn btn-outline-white">{t('maint_cta_storage')}</Link>
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
