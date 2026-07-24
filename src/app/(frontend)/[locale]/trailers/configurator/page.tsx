import Link from 'next/link'
import { PageHero } from '@/components/ui/PageHero'
import { TrailerConfigurator } from '@/components/boats/TrailerConfigurator'
import styles from './configurator.module.css'
import { getLocaleFromParam } from '@/lib/locale'
import { getTranslations } from '@/lib/translations'
import { localePath, hreflangAlternates } from '@/lib/localePath'

export const revalidate = 300

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params
  const locale = getLocaleFromParam(localeParam)
  const t = getTranslations(locale)
  return {
    title: t('trailers_configurator_title'),
    description: t('trailers_configurator_description'),
    alternates: {
      canonical: locale === 'pt' ? 'https://www.algarveboatsales.com/pt/trailers/configurator' : 'https://www.algarveboatsales.com/trailers/configurator',
      languages: hreflangAlternates('/trailers/configurator'),
    },
  }
}

export default async function TrailerConfiguratorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params
  const locale = getLocaleFromParam(localeParam)
  const t = getTranslations(locale)
  return (
    <>
      <PageHero
        title={t('trailers_configurator_hero_title')}
        subtitle={t('trailers_configurator_hero_subtitle')}
        imageSrc="/services/trailer.jpg"
        imageAlt={t('trailers_configurator_hero_alt')}
      />

      <div className="container py-8">
        <div className={styles.top}>
          <Link href={localePath(locale, '/trailers')} className={styles.back}>
            &larr; {t('trailers_back_link')}
          </Link>
        </div>

        <TrailerConfigurator locale={locale} />

        <section className={styles.help}>
          <h2>{t('trailers_help_title')}</h2>
          <p>{t('trailers_help_body')}</p>
          <Link href={localePath(locale, '/contact')} className="btn btn-gold">
            {t('trailers_talk_to_team')}
          </Link>
        </section>
      </div>
    </>
  )
}
