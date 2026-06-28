'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './HeroCarousel.module.css'

export type HeroBoatSlide = {
  src: string
  alt: string
  brand?: string
  name?: string
  price?: string
  href?: string
  featured?: boolean
}

export type HeroHeadline = {
  title: string
  subtitle: string
  body: string
  browseLabel: string
  browseHref: string
  contactLabel: string
  contactHref: string
  viewLabel: string
  featuredLabel: string
}

const FALLBACK_SRC = '/media/spx_38_hero.jpg'

export function HeroCarousel({
  headline,
  slides,
}: {
  headline: HeroHeadline
  slides: HeroBoatSlide[]
}) {
  // First slide is always the marketing headline; brand/boat slides follow.
  const headlineSrc = slides[0]?.src || FALLBACK_SRC
  const allSlides = [
    { kind: 'headline' as const, src: headlineSrc, alt: headline.title },
    ...slides.map((s) => ({ kind: 'boat' as const, ...s })),
  ]
  const count = allSlides.length

  const [active, setActive] = useState(0)

  const go = useCallback((i: number) => setActive(((i % count) + count) % count), [count])

  useEffect(() => {
    if (count <= 1) return
    const timer = setInterval(() => setActive((i) => (i + 1) % count), 6000)
    return () => clearInterval(timer)
  }, [count])

  return (
    <div className={styles.carousel} aria-roledescription="carousel">
      {allSlides.map((slide, i) => (
        <div
          key={i}
          className={`${styles.slide} ${i === active ? styles.slideActive : ''}`}
          aria-hidden={i !== active}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            className={styles.img}
            priority={i === 0}
            sizes="100vw"
          />
          <div className={styles.overlay} />

          <div className={`container ${styles.content}`}>
            {slide.kind === 'headline' ? (
              <div className={styles.headlineBlock}>
                <h1 className={styles.title}>
                  {headline.title}
                  <br />
                  <span className={styles.accent}>{headline.subtitle}</span>
                </h1>
                <p className={styles.sub}>{headline.body}</p>
                <div className={styles.ctas}>
                  <Link href={headline.browseHref} className="btn btn-gold">
                    {headline.browseLabel}
                  </Link>
                  <Link href={headline.contactHref} className="btn btn-outline-white">
                    {headline.contactLabel}
                  </Link>
                </div>
              </div>
            ) : (
              <div className={styles.boatBlock}>
                {slide.featured && <span className={styles.flagship}>{headline.featuredLabel}</span>}
                {slide.brand && <span className={styles.brandChip}>{slide.brand}</span>}
                <h2 className={styles.boatName}>{slide.name}</h2>
                {slide.price && <p className={styles.boatPrice}>{slide.price}</p>}
                {slide.href && (
                  <Link href={slide.href} className="btn btn-gold">
                    {headline.viewLabel}
                  </Link>
                )}
              </div>
            )}
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
            {allSlides.map((_, i) => (
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
