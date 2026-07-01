'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './FeaturedSpotlight.module.css'

export type SpotlightBoat = {
  id: string | number
  slug: string
  title: string
  make?: string
  model?: string
  year?: number
  length_m?: number
  fuel_type?: string
  location?: string
  price: string
  oldPrice?: string | null
  ivaIncluded?: boolean
  condition?: string
  src?: string | null
  alt?: string
}

export function FeaturedSpotlight({
  boats,
  labels,
}: {
  boats: SpotlightBoat[]
  labels: { viewBoat: string; featured: string; ivaIncl: string; newLabel: string; usedLabel: string }
}) {
  const count = boats.length
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  const go = useCallback((i: number) => setActive(((i % count) + count) % count), [count])

  useEffect(() => {
    if (count <= 1 || paused) return
    const timer = setInterval(() => setActive((i) => (i + 1) % count), 5500)
    return () => clearInterval(timer)
  }, [count, paused])

  if (count === 0) return null
  const boat = boats[active]

  return (
    <div
      className={styles.spotlight}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className={styles.media}>
        {boat.src ? (
          <Image
            key={boat.id}
            src={boat.src}
            alt={boat.alt || boat.title}
            fill
            className={styles.image}
            sizes="(max-width: 900px) 100vw, 60vw"
            priority
          />
        ) : (
          <div className={styles.imageFallback} aria-hidden="true" />
        )}
        <span className={styles.featuredBadge}>{labels.featured}</span>
      </div>

      <div className={styles.panel}>
        <div className={styles.panelTop}>
          <div className={styles.makeRow}>
            {boat.make && <span className={styles.make}>{boat.make}</span>}
            {boat.condition && (
              <span className={styles.condition}>
                {boat.condition === 'new' ? labels.newLabel : labels.usedLabel}
              </span>
            )}
          </div>
          <h3 className={styles.title}>{boat.title}</h3>
          {boat.model && <p className={styles.model}>{boat.model}</p>}

          <div className={styles.specs}>
            {boat.year && <span>{boat.year}</span>}
            {boat.length_m && <span>{boat.length_m}m</span>}
            {boat.fuel_type && <span className={styles.capitalize}>{boat.fuel_type}</span>}
            {boat.location && <span>{boat.location}</span>}
          </div>
        </div>

        <div className={styles.panelBottom}>
          <div className={styles.price}>
            {boat.oldPrice && <span className={styles.oldPrice}>{boat.oldPrice}</span>}
            <span className={styles.currentPrice}>{boat.price}</span>
            {boat.ivaIncluded && <span className={styles.ivaTag}>{labels.ivaIncl}</span>}
          </div>
          <Link href={`/boats/${boat.slug}`} className="btn btn-gold">
            {labels.viewBoat}
          </Link>
        </div>

        {count > 1 && (
          <div className={styles.controls}>
            <button type="button" onClick={() => go(active - 1)} className={styles.navBtn} aria-label="Previous featured boat">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            <div className={styles.dots}>
              {boats.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`${styles.dot} ${i === active ? styles.dotActive : ''}`}
                  onClick={() => go(i)}
                  aria-label={`Featured boat ${i + 1}`}
                  aria-current={i === active}
                />
              ))}
            </div>
            <button type="button" onClick={() => go(active + 1)} className={styles.navBtn} aria-label="Next featured boat">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
