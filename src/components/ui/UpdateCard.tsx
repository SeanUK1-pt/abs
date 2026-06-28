import Link from 'next/link'
import Image from 'next/image'
import styles from './UpdateCard.module.css'

function formatDate(value: string, locale: string) {
  try {
    return new Intl.DateTimeFormat(locale === 'pt' ? 'pt-PT' : 'en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(value))
  } catch {
    return ''
  }
}

export function UpdateCard({
  update,
  locale = 'en',
  readMoreLabel,
}: {
  update: any
  locale?: string
  readMoreLabel: string
}) {
  const image = typeof update.image === 'object' ? update.image : null
  const link: string | undefined = update.link || undefined
  const isExternal = !!link && /^https?:\/\//.test(link)

  const inner = (
    <>
      <div className={styles.imageWrap}>
        {image?.url ? (
          <Image
            src={image.url}
            alt={image.alt || update.title}
            fill
            className={styles.image}
            sizes="(max-width: 768px) 100vw, 360px"
          />
        ) : (
          <div className={styles.imageFallback} aria-hidden="true" />
        )}
      </div>
      <div className={styles.body}>
        {update.publish_date && (
          <span className={styles.date}>{formatDate(update.publish_date, locale)}</span>
        )}
        <h3 className={styles.title}>{update.title}</h3>
        {update.summary && <p className={styles.summary}>{update.summary}</p>}
        {link && <span className={styles.readMore}>{readMoreLabel}</span>}
      </div>
    </>
  )

  if (link && isExternal) {
    return (
      <a href={link} className={styles.card} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    )
  }
  if (link) {
    return (
      <Link href={link} className={styles.card}>
        {inner}
      </Link>
    )
  }
  return <article className={styles.card}>{inner}</article>
}
