import Link from 'next/link'
import Image from 'next/image'
import { BoatCard } from '@/components/boats/BoatCard'
import { localePath } from '@/lib/localePath'
import type { PromoPanelData } from '@/lib/navigation'
import styles from './PromoPanel.module.css'

export function PromoPanel({
  panel,
  locale,
  replacesHero = false,
}: {
  panel: PromoPanelData
  locale: string
  replacesHero?: boolean
}) {
  const internal = panel.cta?.url.startsWith('/')
  return (
    // data-nosnippet keeps the campaign text out of Google's search snippets.
    <section className={`${styles.panel} ${replacesHero ? styles.replacesHero : ''}`} data-nosnippet>
      {panel.image && (
        <>
          <Image
            src={panel.image.url}
            alt={panel.image.alt}
            fill
            sizes="100vw"
            priority={replacesHero}
            className={styles.bgImage}
          />
          <div className={styles.scrim} aria-hidden="true" />
        </>
      )}

      <div className={`container ${styles.inner}`}>
        <div className={styles.head}>
          {panel.badge && <span className={styles.badge}>{panel.badge}</span>}
          {panel.headline && <h2 className={styles.headline}>{panel.headline}</h2>}
          {panel.text && <p className={styles.text}>{panel.text}</p>}
          {panel.cta &&
            (internal ? (
              <Link href={localePath(locale, panel.cta.url)} className="btn btn-gold">
                {panel.cta.label}
              </Link>
            ) : (
              <a href={panel.cta.url} className="btn btn-gold" target="_blank" rel="noopener noreferrer">
                {panel.cta.label}
              </a>
            ))}
        </div>

        {panel.boats.length > 0 && (
          <div className={styles.boats}>
            {panel.boats.map(({ boat, note }) => (
              <div key={boat.id} className={styles.boatCol}>
                <BoatCard boat={boat} locale={locale} />
                {note && <p className={styles.note}>{note}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
