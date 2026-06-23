'use client'

import Image from 'next/image'
import { useState } from 'react'
import styles from './GalleryGrid.module.css'

export function GalleryGrid({ images, title }: { images: any[]; title: string }) {
  const [active, setActive] = useState(0)
  const [lightbox, setLightbox] = useState(false)

  if (!images.length) return null

  return (
    <div className={styles.gallery}>
      {/* Main image */}
      <div className={styles.main} onClick={() => setLightbox(true)}>
        <Image
          src={images[active].url}
          alt={images[active].alt || title}
          fill
          className={styles.mainImg}
          sizes="(max-width: 900px) 100vw, 700px"
          priority
        />
        <span className={styles.zoomHint}>🔍 Click to enlarge</span>
        {images.length > 1 && (
          <span className={styles.counter}>{active + 1} / {images.length}</span>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className={styles.thumbs}>
          {images.map((img, i) => (
            <button
              key={i}
              className={`${styles.thumb} ${i === active ? styles.thumbActive : ''}`}
              onClick={() => setActive(i)}
            >
              <Image
                src={img.url}
                alt={img.alt || `${title} ${i + 1}`}
                fill
                className={styles.thumbImg}
                sizes="100px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div className={styles.lightbox} onClick={() => setLightbox(false)}>
          <button className={styles.close} onClick={() => setLightbox(false)}>✕</button>
          <button
            className={`${styles.navBtn} ${styles.prev}`}
            onClick={e => { e.stopPropagation(); setActive(a => Math.max(0, a - 1)) }}
            disabled={active === 0}
          >‹</button>
          <div className={styles.lightboxImg} onClick={e => e.stopPropagation()}>
            <Image
              src={images[active].url}
              alt={images[active].alt || title}
              fill
              className={styles.lightboxImgEl}
              sizes="100vw"
            />
          </div>
          <button
            className={`${styles.navBtn} ${styles.next}`}
            onClick={e => { e.stopPropagation(); setActive(a => Math.min(images.length - 1, a + 1)) }}
            disabled={active === images.length - 1}
          >›</button>
        </div>
      )}
    </div>
  )
}
