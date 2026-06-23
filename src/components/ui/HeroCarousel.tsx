'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import styles from './HeroCarousel.module.css'

const SLIDES = [
  {
    src: '/media/spx_38_hero.jpg',
    alt: 'An SPX 38 RIB underway near the coast',
    brand: 'SPX RIB',
  },
  {
    src: '/media/yamarin_hero-scaled.jpg',
    alt: 'A Yamarin boat cruising on calm water',
    brand: 'Yamarin',
  },
  {
    src: '/media/screenshot-31.png',
    alt: 'A GRAND Golden Line G680 RIB',
    brand: 'GRAND',
  },
]

export function HeroCarousel() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActive(i => (i + 1) % SLIDES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className={styles.carousel}>
      {SLIDES.map((slide, i) => (
        <div
          key={i}
          className={`${styles.slide} ${i === active ? styles.slideActive : ''}`}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            className={styles.img}
            priority={i === 0}
            sizes="100vw"
          />
          <span className={styles.slideBrand}>{slide.brand}</span>
        </div>
      ))}
      <div className={styles.overlay} />
      <div className={styles.dots}>
        {SLIDES.map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === active ? styles.dotActive : ''}`}
            onClick={() => setActive(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
