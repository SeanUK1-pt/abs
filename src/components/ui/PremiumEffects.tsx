'use client'

import { useEffect } from 'react'

/**
 * Progressive, JS-only premium polish that degrades gracefully:
 *  - Scroll-reveal: sections below the fold fade/slide up as they enter view.
 *  - Image fade-in: below-the-fold images fade in once decoded.
 *
 * Nothing is hidden for users without JS (the base classes are added at
 * runtime), above-the-fold content is never touched (protects LCP + avoids
 * flashes), and everything is skipped when the user prefers reduced motion.
 */
export function PremiumEffects() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const main = document.querySelector('main')
    if (!main) return

    const vh = window.innerHeight

    // ── Scroll reveal ──────────────────────────────────
    const sections = Array.from(
      main.querySelectorAll<HTMLElement>(':scope > section, [data-reveal]'),
    )

    const observer = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed')
            obs.unobserve(entry.target)
          }
        }
      },
      { threshold: 0, rootMargin: '0px 0px -10% 0px' },
    )

    const revealed: HTMLElement[] = []
    for (const el of sections) {
      // Skip anything already at/above the fold so the hero + first section
      // stay fully visible and LCP is unaffected.
      if (el.getBoundingClientRect().top < vh * 0.9) continue
      el.classList.add('reveal')
      observer.observe(el)
      revealed.push(el)
    }

    // Safety net: never leave content hidden if something goes wrong.
    const failSafe = window.setTimeout(() => {
      revealed.forEach((el) => el.classList.add('is-revealed'))
    }, 4000)

    // ── Image fade-in (below-the-fold, not yet decoded) ──
    const cleanups: Array<() => void> = []
    main.querySelectorAll<HTMLImageElement>('img').forEach((img) => {
      if (img.getBoundingClientRect().top < vh) return // protect LCP / above fold
      if (img.complete) return
      img.classList.add('img-fade')
      const onLoad = () => img.classList.add('img-loaded')
      img.addEventListener('load', onLoad, { once: true })
      cleanups.push(() => img.removeEventListener('load', onLoad))
    })

    return () => {
      observer.disconnect()
      window.clearTimeout(failSafe)
      cleanups.forEach((fn) => fn())
    }
  }, [])

  return null
}
