'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './HeroCarousel.module.css'

export type HeroSlide = {
  variant: 'intro' | 'brand' | 'brokerage'
  src?: string | null
  alt?: string
  eyebrow?: string
  logoSrc?: string | null
  title: string
  titleAccent?: string
  message?: string
  primaryLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
}

export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const count = slides.length
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  const go = useCallback((i: number) => setActive(((i % count) + count) % count), [count])

  useEffect(() => {
    if (count <= 1 || paused) return
    const timer = setInterval(() => setActive((i) => (i + 1) % count), 6500)
    return () => clearInterval(timer)
  }, [count, paused])

  return (
    <div
      className={styles.carousel}
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`${styles.slide} ${i === active ? styles.slideActive : ''}`}
          aria-hidden={i !== active}
        >
          {slide.src ? (
            <Image
              src={slide.src}
              alt={slide.alt || slide.title}
              fill
              className={styles.img}
              priority={i === 0}
              sizes="100vw"
            />
          ) : (
            <div className={styles.imgFallback} aria-hidden="true" />
          )}
          <div className={`${styles.overlay} ${slide.variant === 'intro' ? styles.overlayIntro : ''}`} />

          <div className={`container ${styles.content}`}>
            <div className={styles.block}>
              {slide.eyebrow && <span className={styles.eyebrow}>{slide.eyebrow}</span>}

              {slide.logoSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={slide.logoSrc} alt={slide.title} className={styles.logo} />
              ) : (
                <h2 className={styles.title}>
                  {slide.title}
                  {slide.titleAccent && (
                    <>
                      <br />
                      <span className={styles.accent}>{slide.titleAccent}</span>
                    </>
                  )}
                </h2>
              )}

              {slide.logoSrc && <span className={styles.srTitle}>{slide.title}</span>}

              {slide.message && <p className={styles.message}>{slide.message}</p>}

              <div className={styles.ctas}>
                {slide.primaryLabel && slide.primaryHref && (
                  <Link href={slide.primaryHref} className="btn btn-gold">
                    {slide.primaryLabel}
                  </Link>
                )}
                {slide.secondaryLabel && slide.secondaryHref && (
                  <Link href={slide.secondaryHref} className="btn btn-outline-white">
                    {slide.secondaryLabel}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {count > 1 && (
        <>
          <button
            type="button"
            className={`${styles.arrow} ${styles.arrowPrev}`}
            onClick={() => go(active - 1)}
            aria-label="Previous slide"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <button
            type="button"
            className={`${styles.arrow} ${styles.arrowNext}`}
            onClick={() => go(active + 1)}
            aria-label="Next slide"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6" /></svg>
          </button>

          <div className={styles.dots}>
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`${styles.dot} ${i === active ? styles.dotActive : ''}`}
                onClick={() => go(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === active}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
