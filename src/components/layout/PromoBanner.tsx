import Link from 'next/link'
import { localePath } from '@/lib/localePath'
import type { PromoBannerData } from '@/lib/navigation'
import styles from './PromoBanner.module.css'

export function PromoBanner({ banner, locale }: { banner: PromoBannerData; locale: string }) {
  const internal = banner.linkUrl?.startsWith('/')
  return (
    // data-nosnippet keeps the banner text out of Google's search snippets.
    <div className={styles.banner} data-nosnippet>
      <span className={styles.message}>{banner.message}</span>
      {banner.linkUrl && banner.linkLabel && (
        internal ? (
          <Link href={localePath(locale, banner.linkUrl)} className={styles.link}>
            {banner.linkLabel}
          </Link>
        ) : (
          <a href={banner.linkUrl} className={styles.link} target="_blank" rel="noopener noreferrer">
            {banner.linkLabel}
          </a>
        )
      )}
    </div>
  )
}
