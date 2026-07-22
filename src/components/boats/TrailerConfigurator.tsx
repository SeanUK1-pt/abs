'use client'

import Image from 'next/image'
import { getTranslations } from '@/lib/translations'
import styles from './TrailerConfigurator.module.css'

const CONFIGURATOR_SRC = 'https://vanclaes.com/product-configurator.php?dealer_cid=104804-e0b5b'
const COOKIE_APPROVE_SRC = 'https://vanclaes.com/safary-cookies-approve.php'

export function TrailerConfigurator({ locale = 'en' }: { locale?: string }) {
  const t = getTranslations(locale as any)
  function approveCookies() {
    // Safari blocks Vanclaes' third-party cookies, which can stop the
    // configurator loading. This briefly opens their cookie-approval page
    // (as a first-party window) then closes it. Offered as an on-demand
    // helper rather than a blocking gate so the tool loads immediately.
    try {
      const win = window.open(
        COOKIE_APPROVE_SRC,
        '_blank',
        'toolbar=no, scrollbars=no, resizable=no, left=100, top=100, width=120, height=140, menubar=no',
      )
      if (win) window.setTimeout(() => win.close(), 2000)
    } catch {
      /* popup blocked — user can accept cookies inside the frame instead */
    }
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.bar}>
        <div className={styles.brand}>
          <span className={styles.logoChip}>
            <Image
              src="/brands/vanclaes.webp"
              alt="Vanclaes"
              width={150}
              height={119}
              className={styles.logo}
            />
          </span>
          <span className={styles.barText}>
            <span className={styles.barEyebrow}>{t('trailers_widget_eyebrow')}</span>
            <span className={styles.barTitle}>{t('trailers_widget_title')}</span>
          </span>
        </div>
        <button type="button" className={styles.cookieBtn} onClick={approveCookies}>
          {t('trailers_widget_cookie_btn')}
        </button>
      </div>

      <div className={styles.frame}>
        <iframe
          name="vanclaes-configurator"
          src={CONFIGURATOR_SRC}
          title="Vanclaes trailer configurator"
          className={styles.iframe}
          allow="fullscreen"
        />
      </div>
    </div>
  )
}
