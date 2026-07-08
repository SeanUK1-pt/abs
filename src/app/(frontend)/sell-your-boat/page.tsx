import { EnquiryForm } from '@/components/forms/EnquiryForm'
import styles from './sell.module.css'
import { getLocale } from '@/lib/locale'
import { getPageData } from '@/lib/getPage'
import { getTranslations } from '@/lib/translations'
import { RichText } from '@/components/ui/RichText'
import { PageHero } from '@/components/ui/PageHero'

export async function generateMetadata() {
  const locale = await getLocale()
  const page = await getPageData('sell-your-boat', locale)
  return {
    title: page?.title ? `${page.title} | Algarve Boat Sales` : 'Sell Your Boat | Algarve Boat Sales',
    description: page?.meta_description || 'Get a free boat valuation from Algarve Boat Sales.',
    alternates: { canonical: 'https://www.algarveboatsales.com/sell-your-boat' },
  }
}

export default async function SellYourBoatPage() {
  const locale = await getLocale()
  const page = await getPageData('sell-your-boat', locale)
  const t = getTranslations(locale)

  const STEPS = [
    { num: '01', title: t('sell_step0_title'), desc: t('sell_step0_desc') },
    { num: '02', title: t('sell_step1_title'), desc: t('sell_step1_desc') },
    { num: '03', title: t('sell_step2_title'), desc: t('sell_step2_desc') },
    { num: '04', title: t('sell_step3_title'), desc: t('sell_step3_desc') },
    { num: '05', title: t('sell_step4_title'), desc: t('sell_step4_desc') },
  ]

  const WHY_BULLETS = [
    t('sell_why0'), t('sell_why1'), t('sell_why2'), t('sell_why3'),
    t('sell_why4'), t('sell_why5'), t('sell_why6'),
  ]

  return (
    <>
      <PageHero
        title={t('sell_title')}
        subtitle={t('sell_subtitle')}
        imageSrc="/media/20241008_104308-min-scaled.jpg"
        imageAlt="A well-maintained boat docked at Marina de Lagos, ready for sale"
      />

      <div className="container">
        <section className={styles.intro}>
          <div>
            <h2>{t('sell_intro_title')}</h2>
            <p>{t('sell_intro_p1')}</p>
            <p>{t('sell_intro_p2')}</p>
          </div>
          <div className={styles.whyUs}>
            <h3>{t('sell_why_title')}</h3>
            <ul>
              {WHY_BULLETS.map(item => (
                <li key={item}><span>✓</span>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className={styles.process}>
          <h2>{t('sell_how_title')}</h2>
          <div className={styles.steps}>
            {STEPS.map(({ num, title, desc }) => (
              <div key={num} className={styles.step}>
                <div className={styles.stepNum}>{num}</div>
                <div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.formSection}>
          <div className={styles.formIntro}>
            <h2>{t('sell_form_title')}</h2>
            <p>{t('sell_form_body')}</p>
          </div>
          <div className={styles.formWrap}>
            <EnquiryForm
              listingTitle="Boat Valuation Request"
              listingType="general"
            />
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
