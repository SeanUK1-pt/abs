import Image from 'next/image'
import styles from './BrandLogos.module.css'

export interface BrandLogo {
  name: string
  /** Filename only, expected to live in /public/media/ */
  file: string
  /** True if the actual logo file hasn't been sourced yet — renders a clearly-labelled placeholder instead of a broken image. */
  pending?: boolean
}

/**
 * Renders a row of brand/partner logos that wraps onto multiple lines on narrow
 * screens, instead of using one fused banner image (which can only shrink, not
 * reflow, and becomes illegible on phones — see Boat Storage page history).
 */
export function BrandLogos({ logos, label }: { logos: BrandLogo[]; label?: string }) {
  return (
    <section className={styles.strip}>
      {label && <p className={styles.label}>{label}</p>}
      <div className={styles.row}>
        {logos.map(logo => (
          logo.pending ? (
            <div key={logo.name} className={styles.pending} data-pending-asset={logo.file}>
              {logo.name}
            </div>
          ) : (
            <div key={logo.name} className={styles.logo}>
              <Image
                src={`/media/${logo.file}`}
                alt={logo.name}
                width={140}
                height={50}
                style={{ objectFit: 'contain', width: 'auto', height: '100%' }}
              />
            </div>
          )
        ))}
      </div>
    </section>
  )
}
