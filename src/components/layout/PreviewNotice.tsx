import styles from './PreviewNotice.module.css'

// Shown only to an admin who has opened the promotion preview.
export function PreviewNotice({ locale }: { locale: string }) {
  return (
    <div className={styles.notice} role="status">
      <span>Preview — the promotion is not live yet</span>
      <a href={`/api/promo-preview-exit?locale=${locale}`}>Exit preview</a>
    </div>
  )
}
