'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useFavourites } from '@/hooks/useFavourites'
import styles from './FavouritesBar.module.css'

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

export function FavouritesBar({ active }: { active: boolean }) {
  const { ids, count } = useFavourites()
  const router = useRouter()
  const searchParams = useSearchParams()

  if (!active && count === 0) return null

  const handleShow = () => {
    if (count === 0) return
    const params = new URLSearchParams(searchParams.toString())
    params.set('ids', ids.join(','))
    params.delete('page')
    router.push(`/boats?${params.toString()}`)
  }

  const handleExit = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('ids')
    params.delete('page')
    router.push(`/boats?${params.toString()}`)
  }

  if (active) {
    return (
      <div className={`${styles.bar} ${styles.barActive}`}>
        <HeartIcon filled />
        <span>Viewing your saved boats</span>
        <button className={styles.exitBtn} onClick={handleExit}>
          Show all boats
        </button>
      </div>
    )
  }

  return (
    <div className={styles.bar}>
      <HeartIcon filled={false} />
      <span>
        {count} saved {count === 1 ? 'boat' : 'boats'}
      </span>
      <button className={styles.showBtn} onClick={handleShow}>
        View favourites
      </button>
    </div>
  )
}
