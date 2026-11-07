import styles from '../terms-and-conditions/legal.module.css'
import { getLocaleFromParam } from '@/lib/locale'
import { getPageData } from '@/lib/getPage'
import { RichText } from '@/components/ui/RichText'
import { hreflangAlternates } from '@/lib/localePath'

export const revalidate = 300

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params
  const locale = getLocaleFromParam(localeParam)
  const page = await getPageData('privacy-policy', locale)
  return {
    title: page?.title ? `${page.title} | Algarve Boat Sales` : 'Privacy Policy | Algarve Boat Sales',
    description: page?.meta_description || 'Privacy policy for Algarve Boat Sales.',
    alternates: {
      canonical: locale === 'pt' ? 'https://www.algarveboatsales.com/pt/privacy-policy' : 'https://www.algarveboatsales.com/privacy-policy',
      languages: hreflangAlternates('/privacy-policy'),
    },
  }
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params
  const locale = getLocaleFromParam(localeParam)
  const page = await getPageData('privacy-policy', locale)

  return (
    <div className="container">
      <div className={styles.page}>
        <h1>{page?.title || (locale === 'pt' ? 'Política de Privacidade' : 'Privacy Policy')}</h1>
        {page?.content ? (
          <RichText content={page.content} />
        ) : (
          // Never leave a legal page empty if the CMS text is ever cleared or unavailable.
          <p>
            {locale === 'pt' ? 'Para obter a nossa política de privacidade, contacte ' : 'To request a copy of our privacy policy, please contact '}
            <a href="mailto:info@algarveboatsales.com">info@algarveboatsales.com</a>.
          </p>
        )}
      </div>
    </div>
  )
}
