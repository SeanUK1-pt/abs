import styles from '../terms-and-conditions/legal.module.css'
import { getLocale } from '@/lib/locale'
import { getPageData } from '@/lib/getPage'
import { RichText } from '@/components/ui/RichText'



export async function generateMetadata() {
  const locale = await getLocale()
  const page = await getPageData('privacy-policy', locale)
  return {
    title: page?.title ? `${page.title} | Algarve Boat Sales` : 'Privacy Policy | Algarve Boat Sales',
    description: page?.meta_description || 'Privacy policy for Algarve Boat Sales.',
  }
}

export default async function PrivacyPage() {
  const locale = await (await import('@/lib/locale')).getLocale()
  const page = await getPageData('privacy-policy', locale)

  return (
    <div className="container">
      <div className={styles.page}>
        <h1>Privacy Policy</h1>
        <p className={styles.updated}>Last updated: January 2025</p>

        <p>Algarve Boat Sales ("we", "us", or "our") operates algarveboatsales.com. This page informs you of our policies regarding the collection, use and disclosure of Personal Information we receive from users of the site.</p>

        <h2>Information We Collect</h2>
        <p>We collect information you provide directly to us when you:</p>
        <ul>
          <li>Submit an enquiry form on a boat or trailer listing</li>
          <li>Contact us via our contact page</li>
          <li>Request a boat valuation</li>
          <li>Subscribe to our newsletter (if applicable)</li>
        </ul>
        <p>This information may include your name, email address, phone number, and the content of your message.</p>

        <h2>How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Respond to your enquiries and provide customer support</li>
          <li>Send you information about boats and services you have requested</li>
          <li>Improve our website and services</li>
          <li>Comply with legal obligations</li>
        </ul>

        <h2>Data Retention</h2>
        <p>We retain personal data only for as long as necessary to fulfil the purpose for which it was collected, or as required by law. Enquiry data is typically retained for 24 months.</p>

        <h2>Data Sharing</h2>
        <p>We do not sell, trade, or otherwise transfer your personally identifiable information to third parties. This does not include trusted third parties who assist us in operating our website or servicing you, so long as those parties agree to keep this information confidential.</p>

        <h2>Cookies</h2>
        <p>Our website uses cookies to improve your browsing experience. You can choose to disable cookies through your browser settings; however, some features of the site may not function correctly if you do so.</p>

        <h2>Your Rights (GDPR)</h2>
        <p>If you are based in the European Union, you have the following rights under GDPR:</p>
        <ul>
          <li><strong>Right of access</strong> — you can request a copy of the personal data we hold about you</li>
          <li><strong>Right to rectification</strong> — you can ask us to correct inaccurate data</li>
          <li><strong>Right to erasure</strong> — you can ask us to delete your personal data</li>
          <li><strong>Right to object</strong> — you can object to our processing of your data</li>
        </ul>
        <p>To exercise any of these rights, please contact us at <a href="mailto:info@algarveboatsales.com">info@algarveboatsales.com</a>.</p>

        <h2>Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us:</p>
        <ul>
          <li>Email: <a href="mailto:info@algarveboatsales.com">info@algarveboatsales.com</a></li>
          <li>Address: Marina de Lagos, Loja 11, Lagos 8600-780, Portugal</li>
          <li>Phone: (+351) 282 045 109</li>
        </ul>
      </div>
    </div>
  )
}
