import { EnquiryForm } from '@/components/forms/EnquiryForm'
import styles from './sell.module.css'
import { getLocale } from '@/lib/locale'
import { getPageData } from '@/lib/getPage'
import { RichText } from '@/components/ui/RichText'
import { PageHero } from '@/components/ui/PageHero'
import { getTranslations } from '@/lib/translations'

const STEPS = {
  en: [
    { num: '01', title: 'Free Valuation', desc: "Fill in the form below. We'll review your details and send you a market valuation within 48 hours — no obligation." },
    { num: '02', title: 'Agree Terms', desc: "If you're happy with the valuation, we agree a sale price and our commission. We take care of everything from there." },
    { num: '03', title: 'We List Your Boat', desc: 'We photograph your vessel, list it on our website, and market it to our database of qualified buyers.' },
    { num: '04', title: 'Viewings & Sea Trials', desc: 'We manage all enquiries, viewings, and sea trials on your behalf — saving you time and hassle.' },
    { num: '05', title: 'Sale & Payment', desc: 'Once a buyer is found, we handle the negotiation and ensure secure payment before the handover.' },
  ],
  pt: [
    { num: '01', title: 'Avaliação Gratuita', desc: 'Preencha o formulário abaixo. Analisaremos os seus dados e enviaremos uma avaliação de mercado em 48 horas — sem compromisso.' },
    { num: '02', title: 'Acordar Condições', desc: 'Se concordar com a avaliação, acordamos o preço de venda e a nossa comissão. A partir daí, tratamos de tudo.' },
    { num: '03', title: 'Listamos o Seu Barco', desc: 'Fotografamos a sua embarcação, publicamo-la no nosso site e divulgamo-la à nossa base de dados de compradores qualificados.' },
    { num: '04', title: 'Visitas e Provas no Mar', desc: 'Gerimos todos os contactos, visitas e provas no mar em seu nome — poupando-lhe tempo e complicações.' },
    { num: '05', title: 'Venda e Pagamento', desc: 'Quando encontramos um comprador, tratamos da negociação e garantimos o pagamento seguro antes da entrega.' },
  ],
}

const WHY_US = {
  en: [
    'Free, no-obligation valuation',
    'Professional photography included',
    'Listed on algarveboatsales.com',
    'Marketed to our buyer database',
    'We manage all viewings & sea trials',
    'Secure payment handling',
    'Paperwork assistance included',
  ],
  pt: [
    'Avaliação gratuita e sem compromisso',
    'Fotografia profissional incluída',
    'Publicado em algarveboatsales.com',
    'Divulgado à nossa base de compradores',
    'Gerimos todas as visitas e provas no mar',
    'Pagamento seguro garantido',
    'Apoio na documentação incluído',
  ],
}

export async function generateMetadata() {
  const locale = await getLocale()
  const page = await getPageData('sell-your-boat', locale)
  const t = getTranslations(locale)
  return {
    title: page?.title ? `${page.title} | Algarve Boat Sales` : `${t('sell_title')} | Algarve Boat Sales`,
    description: page?.meta_description || 'Get a free boat valuation from Algarve Boat Sales.',
    alternates: { canonical: 'https://www.algarveboatsales.com/sell-your-boat' },
  }
}

export default async function SellYourBoatPage() {
  const locale = await getLocale()
  const t = getTranslations(locale)
  const page = await getPageData('sell-your-boat', locale)
  const steps = STEPS[locale]
  const whyUs = WHY_US[locale]

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
              {whyUs.map(item => (
                <li key={item}><span>✓</span>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className={styles.process}>
          <h2>{t('sell_how_title')}</h2>
          <div className={styles.steps}>
            {steps.map(({ num, title, desc }) => (
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

      {page?.content && (
        <div className="container" style={{ paddingBottom: '3rem' }}>
          <RichText content={page.content} className="richtext-content" />
        </div>
      )}
    </>
  )
}
