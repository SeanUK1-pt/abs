import Link from 'next/link'
import Image from 'next/image'
import styles from './BoatCard.module.css'

function formatPrice(price: number, currency = 'EUR') {
  return new Intl.NumberFormat('en-EU', { style: 'currency', currency, maximumFractionDigits: 0 }).format(price)
}

const STATUS_LABELS: Record<string, Record<string, string>> = {
  en: { available: 'Available', under_offer: 'Under Offer', sold: 'Sold', new: 'New', used: 'Used' },
  pt: { available: 'Disponível', under_offer: 'Em Negociação', sold: 'Vendido', new: 'Novo', used: 'Usado' },
}

const IVA_LABEL: Record<string, string> = { en: 'IVA incl.', pt: 'IVA incl.' }

export function BoatCard({ boat, locale = 'en' }: { boat: any; locale?: string }) {
  const labels = STATUS_LABELS[locale] || STATUS_LABELS.en
  const displayPrice = boat.sale_price || boat.price
  const mainImage = typeof boat.main_image === 'object' ? boat.main_image : null
  const make = typeof boat.make === 'object' ? boat.make?.name : ''
  const model = typeof boat.model === 'object' ? boat.model?.name : ''

  const statusLabel = labels

  return (
    <Link href={`/boats/${boat.slug}`} className={styles.card}>
      <div className={styles.imageWrap}>
        {mainImage?.url ? (
          <Image
            src={mainImage.url}
            alt={mainImage.alt || boat.title}
            fill
            className={styles.image}
            sizes="(max-width: 768px) 100vw, 400px"
          />
        ) : (
          <div className={styles.imagePlaceholder}>
            <span>No Image</span>
          </div>
        )}

        {/* Status badge */}
        <span className={`${styles.statusBadge} badge badge-${boat.status?.replace('_', '-')}`}>
          {statusLabel[boat.status] || boat.status}
        </span>

        {/* Custom badge */}
        {boat.badge_text && (
          <span
            className={styles.customBadge}
            style={{ background: boat.badge_color || '#dd3333' }}
          >
            {boat.badge_text}
          </span>
        )}

        {/* Condition */}
        <span className={`${styles.conditionBadge} badge badge-${boat.condition}`}>
          {boat.condition === 'new' ? labels.new : labels.used}
        </span>
      </div>

      <div className={styles.body}>
        <div className={styles.makeModel}>
          {make && <span className={styles.make}>{make}</span>}
          {model && <span className={styles.model}>{model}</span>}
        </div>

        <h3 className={styles.title}>{boat.title}</h3>

        <div className={styles.specs}>
          {boat.year && <span>{boat.year}</span>}
          {boat.length_m && <span>{boat.length_m}m</span>}
          {boat.engine_hours != null && <span>{boat.engine_hours}h</span>}
          {boat.fuel_type && <span className={styles.capitalize}>{boat.fuel_type}</span>}
        </div>

        <div className={styles.footer}>
          <div className={styles.price}>
            {boat.sale_price && <span className={styles.oldPrice}>{formatPrice(boat.price, boat.currency)}</span>}
            <span className={styles.currentPrice}>
              {formatPrice(displayPrice, boat.currency)}
            </span>
            {boat.iva_included && <span className={styles.ivaTag}>{IVA_LABEL[locale] || 'IVA incl.'}</span>}
          </div>
          {boat.location && <span className={styles.location}>📍 {boat.location}</span>}
        </div>
      </div>
    </Link>
  )
}
