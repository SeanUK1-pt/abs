'use client'
import { useFavourites } from '@/hooks/useFavourites'
import styles from './FavouriteButton.module.css'

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

/** Icon-only button — floats over the card image */
export function FavouriteButton({ boatId }: { boatId: string }) {
  const { has, toggle } = useFavourites()
  const saved = has(boatId)

  return (
    <button
      type="button"
      className={`${styles.iconBtn} ${saved ? styles.saved : ''}`}
      onClick={e => { e.preventDefault(); e.stopPropagation(); toggle(boatId) }}
      aria-label={saved ? 'Remove from favourites' : 'Save to favourites'}
      title={saved ? 'Remove from favourites' : 'Save to favourites'}
    >
      <HeartIcon filled={saved} />
    </button>
  )
}

/** Text button — sits inside the card body */
export function FavouriteTextButton({ boatId }: { boatId: string }) {
  const { has, toggle } = useFavourites()
  const saved = has(boatId)

  return (
    <button
      type="button"
      className={`${styles.textBtn} ${saved ? styles.textSaved : ''}`}
      onClick={e => { e.preventDefault(); e.stopPropagation(); toggle(boatId) }}
    >
      <HeartIcon filled={saved} />
      {saved ? 'Saved to favourites' : 'Add to favourites'}
    </button>
  )
}
