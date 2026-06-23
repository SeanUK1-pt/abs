import Image from 'next/image'
import { EnquiryForm } from '@/components/forms/EnquiryForm'
import { getLocale } from '@/lib/locale'
import { getTranslations } from '@/lib/translations'
import styles from './contact.module.css'

export async function generateMetadata() {
  const locale = await getLocale()
  const t = getTranslations(locale)
  return {
    title: `${t('contact_title')} | Algarve Boat Sales`,
  }
}

export default async function ContactPage() {
  const locale = await getLocale()
  const t = getTranslations(locale)

  return (
    <>
      {/* Hero */}
      <section className={styles.hero}>
        <Image
          src="/media/1-456172121_1068969185231903_5259817831988184865_n.jpg"
          alt="RIB boats out on the water"
          fill
          className={styles.heroImg}
          priority
          sizes="100vw"
        />
        <div className={styles.heroOverlay} />
        <div className={`container ${styles.heroContent}`}>
          <h1>{t('contact_title')}</h1>
          <p>{t('contact_hero_sub')}</p>
        </div>
      </section>

      <div className="container py-8">
        <div className={styles.page}>
          <div className={styles.info}>
            <h2>{t('contact_details')}</h2>
            <p className={styles.intro}>{t('contact_intro')}</p>

            <div className={styles.details}>
              <div className={styles.detailItem}>
                <div>
                  <strong>{t('contact_sales_dir')}</strong>
                  <p>Miguel Gonçalves</p>
                  <a href="mailto:miguel@algarveboatgroup.com">miguel@algarveboatgroup.com</a>
                  <a href="tel:+351963692451">+351 963 692 451</a>
                </div>
              </div>
              <div className={styles.detailItem}>
                <div>
                  <strong>{t('contact_address')}</strong>
                  <p>Marina de Lagos, Loja 11<br />Lagos 8600-780, Portugal</p>
                  <p className={styles.hint}>{t('contact_address_hint')}</p>
                </div>
              </div>
              <div className={styles.detailItem}>
                <div>
                  <strong>{t('contact_phone')}</strong>
                  <a href="tel:+351282045109">(+351) 282 045 109</a>
                  <a href="tel:+443308080317">(+44) 330 808 0317</a>
                </div>
              </div>
              <div className={styles.detailItem}>
                <div>
                  <strong>{t('contact_hours')}</strong>
                  <p>{t('contact_hours_value')}</p>
                </div>
              </div>
              <div className={styles.detailItem}>
                <div>
                  <strong>{t('contact_whatsapp')}</strong>
                  <a href="https://wa.me/351963692451">{t('contact_whatsapp_link')}</a>
                </div>
              </div>
            </div>

            <div className={styles.mapWrap}>
              <iframe
                src="https://www.google.com/maps?q=Algarve+Boat+Sales,+Marina+de+Lagos,+Loja+11,+8600-780+Lagos,+Portugal&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Map showing the location of Algarve Boat Sales at Marina de Lagos"
              />
            </div>
          </div>

          <div className={styles.formWrap}>
            <div className={styles.formCard}>
              <h2>{t('contact_form_title')}</h2>
              <p>{t('contact_form_sub')}</p>
              <EnquiryForm
                listingTitle={locale === 'pt' ? 'Consulta Geral' : 'General Enquiry'}
                listingType="general"
                locale={locale}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
