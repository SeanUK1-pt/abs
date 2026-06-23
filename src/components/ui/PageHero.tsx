import Image from 'next/image'
import styles from './PageHero.module.css'

interface PageHeroProps {
  title: string
  subtitle?: string
  imageSrc: string
  imageAlt: string
  /** Pass true only for the hero that appears above the fold on first paint (usually just one per page). */
  priority?: boolean
}

/**
 * Full-bleed photo hero with a dark gradient overlay and title/subhead on top.
 * Shared across content pages (Boat Storage, Maintenance, Services, About, etc.)
 * so a single fix here propagates everywhere instead of being copy-pasted per page.
 */
export function PageHero({ title, subtitle, imageSrc, imageAlt, priority = true }: PageHeroProps) {
  return (
    <section className={styles.hero}>
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        priority={priority}
        sizes="100vw"
        className={styles.heroImg}
      />
      <div className={styles.heroOverlay} />
      <div className={`container ${styles.heroContent}`}>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </section>
  )
}
