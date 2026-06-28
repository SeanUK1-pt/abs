'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import styles from './BrandCarousel.module.css'

export type BrandImage = { src: string; alt: string }

export function BrandCarousel({ images, name }: { images: BrandImage[]; name: string }) {
  const count = images.length
  const [active, setActive] = useState(0)

  const go = useCallback((i: number) => setActive(((i % count) + count) % count), [count])

  useEffect(() => {
    if (count <= 1) return
    const timer = setInterval(() => setActive((i) => (i + 1) % count), 4500)
    return () => clearInterval(timer)
  }, [count])

  if (count === 0) {
    return (
      <div className={styles.pending} data-pending-asset={`${name.toLowerCase().replace(/\s+/g, '-')}-hero.jpg`}>
        Photo coming soon
      </div>
    )
  }

  return (
    <div className={styles.carousel} aria-roledescription="carousel" aria-label={`${name} gallery`}>
      {images.map((img, i) => (
        <div
          key={i}
          className={`${styles.slide} ${i === active ? styles.slideActive : ''}`}
          aria-hidden={i !== active}
        >
          <Image src={img.src} alt={img.alt} fill className={styles.img} sizes="(max-width: 900px) 100vw, 1200px" />
        </div>
      ))}
      <div className={styles.overlay} />

      {count > 1 && (
        <>
          <button
            type="button"
            className={`${styles.arrow} ${styles.arrowPrev}`}
            onClick={() => go(active - 1)}
            aria-label="Previous image"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <button
            type="button"
            className={`${styles.arrow} ${styles.arrowNext}`}
            onClick={() => go(active + 1)}
            aria-label="Next image"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
          <div className={styles.dots}>
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`${styles.dot} ${i === active ? styles.dotActive : ''}`}
                onClick={() => go(i)}
                aria-label={`Go to image ${i + 1}`}
                aria-current={i === active}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
