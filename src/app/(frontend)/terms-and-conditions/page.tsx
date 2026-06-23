import styles from './legal.module.css'
import { getLocale } from '@/lib/locale'
import { getPageData } from '@/lib/getPage'
import { RichText } from '@/components/ui/RichText'



export async function generateMetadata() {
  const locale = await getLocale()
  const page = await getPageData('terms-and-conditions', locale)
  return {
    title: page?.title ? `${page.title} | Algarve Boat Sales` : 'Terms & Conditions | Algarve Boat Sales',
    description: page?.meta_description || 'Terms and conditions for use of the Algarve Boat Sales website.',
  }
}

export default async function TermsPage() {
  const locale = await (await import('@/lib/locale')).getLocale()
  const page = await getPageData('terms-and-conditions', locale)

  return (
    <div className="container">
      <div className={styles.page}>
        <h1>Terms & Conditions</h1>
        <p className={styles.updated}>Last updated: January 2025</p>

        <p>Welcome to algarveboatsales.com. These terms and conditions outline the rules and regulations for the use of Algarve Boat Sales's website. By accessing this website we assume you accept these terms and conditions. Do not continue to use algarveboatsales.com if you do not agree to all of the terms and conditions stated on this page.</p>

        <h2>Terminology</h2>
        <p>The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice and all Agreements: "Client", "You" and "Your" refers to you, the person accessing this website and accepting the Company's terms and conditions. "The Company", "Ourselves", "We", "Our" and "Us", refers to Algarve Boat Sales. "Party", "Parties", or "Us", refers to both the Client and ourselves.</p>

        <h2>Cookies</h2>
        <p>We employ the use of cookies. By accessing algarveboatsales.com, you agreed to use cookies in agreement with Algarve Boat Sales's Privacy Policy. Most interactive websites use cookies to let us retrieve the user's details for each visit.</p>

        <h2>License</h2>
        <p>Unless otherwise stated, Algarve Boat Sales and/or its licensors own the intellectual property rights for all material on algarveboatsales.com. All intellectual property rights are reserved. You may access this from algarveboatsales.com for your own personal use subjected to restrictions set in these terms and conditions.</p>
        <p>You must not:</p>
        <ul>
          <li>Republish material from algarveboatsales.com</li>
          <li>Sell, rent or sub-license material from algarveboatsales.com</li>
          <li>Reproduce, duplicate or copy material from algarveboatsales.com</li>
          <li>Redistribute content from algarveboatsales.com</li>
        </ul>

        <h2>Disclaimer</h2>
        <p>To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website. Nothing in this disclaimer will:</p>
        <ul>
          <li>limit or exclude our or your liability for death or personal injury;</li>
          <li>limit or exclude our or your liability for fraud or fraudulent misrepresentation;</li>
          <li>limit any of our or your liabilities in any way that is not permitted under applicable law; or</li>
          <li>exclude any of our or your liabilities that may not be excluded under applicable law.</li>
        </ul>

        <h2>Pricing & Listings</h2>
        <p>All prices shown on this website are indicative and subject to change without notice. Algarve Boat Sales reserves the right to withdraw any listing at any time. Prices are shown in Euros (EUR) unless otherwise stated. IVA/VAT status is indicated on each individual listing.</p>

        <h2>Contact</h2>
        <p>If you have any questions about these Terms & Conditions, please contact us at <a href="mailto:info@algarveboatsales.com">info@algarveboatsales.com</a>.</p>
      </div>
    </div>
  )
}
