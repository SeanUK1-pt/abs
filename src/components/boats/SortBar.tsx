'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import styles from './SortBar.module.css'

const LABELS: Record<string, Record<string, string>> = {
  en: { sort_by: 'Sort by:', newest: 'Newest First', price_asc: 'Price: Low to High', price_desc: 'Price: High to Low', length: 'Length' },
  pt: { sort_by: 'Ordenar por:', newest: 'Mais Recentes', price_asc: 'Preço: Menor para Maior', price_desc: 'Preço: Maior para Menor', length: 'Comprimento' },
}

export function SortBar({ currentSort, locale = 'en' }: { currentSort?: string; locale?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const l = LABELS[locale] || LABELS.en

  function handleSort(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', value)
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className={styles.bar}>
      <label className={styles.label}>{l.sort_by}</label>
      <select
        value={currentSort || 'newest'}
        onChange={e => handleSort(e.target.value)}
        className={styles.select}
      >
        <option value="newest">{l.newest}</option>
        <option value="price_asc">{l.price_asc}</option>
        <option value="price_desc">{l.price_desc}</option>
        <option value="length">{l.length}</option>
      </select>
    </div>
  )
}
