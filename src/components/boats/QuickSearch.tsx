'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import styles from './QuickSearch.module.css'

const LABELS: Record<string, Record<string, string>> = {
  en: { title: 'Quick Search', condition: 'Condition', type: 'Boat Type', price: 'Max Price', length: 'Max Length', search: 'Search Boats', all: '', new: 'New', used: 'Used' },
  pt: { title: 'Pesquisa Rápida', condition: 'Estado', type: 'Tipo de Barco', price: 'Preço Máximo', length: 'Comprimento Máximo', search: 'Pesquisar Barcos', all: '', new: 'Novo', used: 'Usado' },
}

export function QuickSearch({ locale = 'en' }: { locale?: string }) {
  const l = LABELS[locale] || LABELS.en
  const router = useRouter()
  const [form, setForm] = useState({
    condition: '',
    boat_type: '',
    price_max: '',
    length_max: '',
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    Object.entries(form).forEach(([k, v]) => { if (v) params.set(k, v) })
    router.push(`/boats?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h3 className={styles.label}>{l.title}</h3>

      <div className={styles.fields}>
        <select
          value={form.condition}
          onChange={e => setForm(f => ({ ...f, condition: e.target.value }))}
          className={styles.select}
        >
          <option value="">{l.condition}</option>
          <option value="new">{l.new}</option>
          <option value="used">{l.used}</option>
        </select>

        <select
          value={form.boat_type}
          onChange={e => setForm(f => ({ ...f, boat_type: e.target.value }))}
          className={styles.select}
        >
          <option value="">{l.type}</option>
          <option value="rib">RIB</option>
          <option value="bow_rider">Bow Rider</option>
          <option value="sports_cruiser">Sports Cruiser</option>
          <option value="power_boat">Power Boat</option>
          <option value="sailboat">Sailboat</option>
          <option value="pwc">Personal Watercraft</option>
        </select>

        <select
          value={form.price_max}
          onChange={e => setForm(f => ({ ...f, price_max: e.target.value }))}
          className={styles.select}
        >
          <option value="">{l.price}</option>
          <option value="25000">€25,000</option>
          <option value="50000">€50,000</option>
          <option value="100000">€100,000</option>
          <option value="200000">€200,000</option>
          <option value="500000">€500,000</option>
        </select>

        <select
          value={form.length_max}
          onChange={e => setForm(f => ({ ...f, length_max: e.target.value }))}
          className={styles.select}
        >
          <option value="">{l.length}</option>
          <option value="6">Up to 6m</option>
          <option value="8">Up to 8m</option>
          <option value="10">Up to 10m</option>
          <option value="15">Up to 15m</option>
        </select>

        <button type="submit" className={styles.searchBtn}>
          {l.search}
        </button>
      </div>
    </form>
  )
}
