import { getLocaleFromParam } from '@/lib/locale'
import { getTranslations } from '@/lib/translations'
import { getBrokerageText } from '@/lib/navigation'
import styles from './BrokerageDisclaimer.module.css'

// card:  compact line on a results card
// short: one line beside the price on the boat page
// full:  the complete disclaimer, its own section on the boat page
// The wording comes from the admin (Site Settings), with the standard text as a fallback.
export async function BrokerageDisclaimer({ locale, variant }: { locale: string; variant: 'card' | 'short' | 'full' }) {
  const loc = getLocaleFromParam(locale)
  const t = getTranslations(loc)
  const text = await getBrokerageText(loc)

  if (variant === 'full') {
    return (
      <div className={styles.box}>
        <p className={styles.title}>{t('brokerage_title')}</p>
        <p className={styles.text}>{text.full}</p>
      </div>
    )
  }
  return (
    <p className={variant === 'card' ? styles.card : styles.strip}>
      <strong>{t('brokerage_label')}</strong> · {text.short}
    </p>
  )
}
