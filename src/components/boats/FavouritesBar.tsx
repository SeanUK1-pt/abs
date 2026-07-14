'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useFavourites } from '@/hooks/useFavourites'
import { localePath } from '@/lib/localePath'
import styles from './FavouritesBar.module.css'

const LABELS = {
  en: {
    viewing: 'Viewing your saved boats',
    showAll: 'Show all boats',
    saved: (n: number) => `${n} saved ${n === 1 ? 'boat' : 'boats'}`,
    viewFavs: 'View favourites',
  },
  pt: {
    viewing: 'A ver os seus barcos guardados',
    showAll: 'Ver todos os barcos',
    saved: (n: number) => `${n} ${n === 1 ? 'barco guardado' : 'barcos guardados'}`,
    viewFavs: 'Ver favoritos',
  },
}

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)

export function FavouritesBar({ active, locale = 'en' }: { active: boolean; locale?: string }) {
  const { count } = useFavourites()
  const router = useRouter()
  const searchParams = useSearchParams()
  const l = LABELS[locale as keyof typeof LABELS] || LABELS.en

  if (!active && count === 0) return null

  const handleShow = () => {
    if (count === 0) return
    router.push(localePath(locale, '/boats?favourites=1'))
  }

  const handleExit = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('favourites')
    params.delete('page')
    const qs = params.toString()
    router.push(localePath(locale, qs ? `/boats?${qs}` : '/boats'))
  }

  if (active) {
    return (
      <div className={`${styles.bar} ${styles.barActive}`}>
        <HeartIcon filled />
        <span>{l.viewing}</span>
        <button className={styles.exitBtn} onClick={handleExit}>
          {l.showAll}
        </button>
      </div>
    )
  }

  return (
    <div className={styles.bar}>
      <HeartIcon filled={false} />
      <span>{l.saved(count)}</span>
      <button className={styles.showBtn} onClick={handleShow}>
        {l.viewFavs}
      </button>
    </div>
  )
}
