import { EnquiryForm } from '@/components/forms/EnquiryForm'
import styles from './sell.module.css'
import { getLocale } from '@/lib/locale'
import { getPageData } from '@/lib/getPage'
import { RichText } from '@/components/ui/RichText'
import { PageHero } from '@/components/ui/PageHero'



const STEPS = [
  { num: '01', title: 'Free Valuation', desc: 'Fill in the form below. We\'ll review your details and send you a market valuation within 48 hours — no obligation.' },
  { num: '02', title: 'Agree Terms', desc: 'If you\'re happy with the valuation, we agree a sale price and our commission. We take care of everything from there.' },
  { num: '03', title: 'We List Your Boat', desc: 'We photograph your vessel, list it on our website, and market it to our database of qualified buyers.' },
  { num: '04', title: 'Viewings & Sea Trials', desc: 'We manage all enquiries, viewings, and sea trials on your behalf — saving you time and hassle.' },
  { num: '05', title: 'Sale & Payment', desc: 'Once a buyer is found, we handle the negotiation and ensure secure payment before the handover.' },
]

export async function generateMetadata() {
  const locale = await getLocale()
  const page = await getPageData('sell-your-boat', locale)
  return {
    title: page?.title ? `${page.title} | Algarve Boat Sales` : 'Sell Your Boat | Algarve Boat Sales',
    description: page?.meta_description || 'Get a free boat valuation from Algarve Boat Sales.',
  }
}

export default async function SellYourBoatPage() {
  const locale = await (await import('@/lib/locale')).getLocale()
  const page = await getPageData('sell-your-boat', locale)

  return (
    <>
      <PageHero
        title="Sell Your Boat"
        subtitle="Get a free valuation — we handle everything from listing to handover"
        imageSrc="/media/20241008_104308-min-scaled.jpg"
        imageAlt="A well-maintained boat docked at Marina de Lagos, ready for sale"
      />

      <div className="container">
        <section className={styles.intro}>
          <div>
            <h2>Hassle-Free Boat Brokerage</h2>
            <p>
              Selling a boat privately can be time-consuming and complicated. Let us do the hard work.
              Algarve Boat Sales has an established network of qualified buyers and a strong online presence
              — meaning your boat gets seen by the right people, fast.
            </p>
            <p>
              Fill in the valuation form and we'll get back to you within 48 hours with a realistic market
              assessment. From there, it's entirely your decision — no pressure, no obligation.
            </p>
          </div>
          <div className={styles.whyUs}>
            <h3>Why sell with us?</h3>
            <ul>
              {[
                'Free, no-obligation valuation',
                'Professional photography included',
                'Listed on algarveboatsales.com',
                'Marketed to our buyer database',
                'We manage all viewings & sea trials',
                'Secure payment handling',
                'Paperwork assistance included',
              ].map(item => (
                <li key={item}><span>✓</span>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className={styles.process}>
          <h2>How It Works</h2>
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
            <h2>Request Your Free Valuation</h2>
            <p>
              Tell us about your boat below. Include as much detail as you can — make, model, year, condition,
              engine hours, and any significant equipment. We'll get back to you within 48 hours.
            </p>
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
