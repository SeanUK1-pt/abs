'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useState, useCallback } from 'react'
import styles from './FilterSidebar.module.css'

const L: Record<string, Record<string, string>> = {
  en: { filters: 'Filters', clear_all: 'Clear all', condition: 'Condition', type: 'Boat Type', make: 'Make', price: 'Price (€)', length: 'Length (m)', year: 'Year', fuel: 'Fuel Type', drive: 'Drive Type', hull: 'Hull Material', new: 'New', used: 'Used', all_types: 'All Types', all_makes: 'All Makes', all: 'All' },
  pt: { filters: 'Filtros', clear_all: 'Limpar tudo', condition: 'Estado', type: 'Tipo de Barco', make: 'Marca', price: 'Preço (€)', length: 'Comprimento (m)', year: 'Ano', fuel: 'Combustível', drive: 'Propulsão', hull: 'Material do Casco', new: 'Novo', used: 'Usado', all_types: 'Todos os Tipos', all_makes: 'Todas as Marcas', all: 'Todos' },
}

export function FilterSidebar({ searchParams, makes, filterableFeatures, locale = 'en' }: any) {
  const l = L[locale] || L.en
  const router = useRouter()
  const pathname = usePathname()

  const [filters, setFilters] = useState({
    condition: searchParams.condition || '',
    boat_type: searchParams.boat_type || '',
    make: searchParams.make || '',
    price_min: searchParams.price_min || '',
    price_max: searchParams.price_max || '',
    length_min: searchParams.length_min || '',
    length_max: searchParams.length_max || '',
    year_min: searchParams.year_min || '',
    year_max: searchParams.year_max || '',
    fuel_type: searchParams.fuel_type || '',
    drive_type: searchParams.drive_type || '',
    hull_material: searchParams.hull_material || '',
  })

  const apply = useCallback((updated: typeof filters) => {
    const params = new URLSearchParams()
    Object.entries(updated).forEach(([k, v]) => { if (v) params.set(k, v) })
    router.push(`${pathname}?${params.toString()}`)
  }, [pathname, router])

  const set = (key: string, value: string) => {
    const updated = { ...filters, [key]: value }
    setFilters(updated)
    apply(updated)
  }

  const clear = () => {
    const reset: typeof filters = {
      condition: '', boat_type: '', make: '',
      price_min: '', price_max: '', length_min: '', length_max: '',
      year_min: '', year_max: '', fuel_type: '', drive_type: '', hull_material: '',
    }
    setFilters(reset)
    router.push(pathname)
  }

  const hasFilters = Object.values(filters).some(Boolean)

  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <h3>{l.filters}</h3>
        {hasFilters && <button onClick={clear} className={styles.clearBtn}>{l.clear_all}</button>}
      </div>

      <FilterGroup title={l.condition}>
        {['new', 'used'].map(v => (
          <label key={v} className={styles.checkLabel}>
            <input
              type="radio"
              name="condition"
              value={v}
              checked={filters.condition === v}
              onChange={() => set('condition', filters.condition === v ? '' : v)}
            />
            <span>{v === 'new' ? l.new : l.used}</span>
          </label>
        ))}
      </FilterGroup>

      <FilterGroup title={l.type}>
        <select value={filters.boat_type} onChange={e => set('boat_type', e.target.value)} className={styles.select}>
          <option value="">{l.all_types}</option>
          <option value="rib">RIB</option>
          <option value="bow_rider">Bow Rider</option>
          <option value="sports_cruiser">Sports Cruiser</option>
          <option value="power_boat">Power Boat</option>
          <option value="sailboat">Sailboat</option>
          <option value="pwc">Personal Watercraft</option>
          <option value="aluminium_hull">Aluminium Hull</option>
        </select>
      </FilterGroup>

      <FilterGroup title={l.make}>
        <select value={filters.make} onChange={e => set('make', e.target.value)} className={styles.select}>
          <option value="">{l.all_makes}</option>
          {makes.map((m: any) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
      </FilterGroup>

      <FilterGroup title={l.price}>
        <div className={styles.rangeRow}>
          <input
            type="number"
            placeholder="Min"
            value={filters.price_min}
            onChange={e => setFilters(f => ({ ...f, price_min: e.target.value }))}
            onBlur={() => apply(filters)}
            className={styles.rangeInput}
          />
          <span>–</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.price_max}
            onChange={e => setFilters(f => ({ ...f, price_max: e.target.value }))}
            onBlur={() => apply(filters)}
            className={styles.rangeInput}
          />
        </div>
      </FilterGroup>

      <FilterGroup title={l.length}>
        <div className={styles.rangeRow}>
          <input
            type="number"
            placeholder="Min"
            value={filters.length_min}
            onChange={e => setFilters(f => ({ ...f, length_min: e.target.value }))}
            onBlur={() => apply(filters)}
            className={styles.rangeInput}
            step="0.5"
          />
          <span>–</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.length_max}
            onChange={e => setFilters(f => ({ ...f, length_max: e.target.value }))}
            onBlur={() => apply(filters)}
            className={styles.rangeInput}
            step="0.5"
          />
        </div>
      </FilterGroup>

      <FilterGroup title={l.year}>
        <div className={styles.rangeRow}>
          <input
            type="number"
            placeholder="From"
            value={filters.year_min}
            onChange={e => setFilters(f => ({ ...f, year_min: e.target.value }))}
            onBlur={() => apply(filters)}
            className={styles.rangeInput}
          />
          <span>–</span>
          <input
            type="number"
            placeholder="To"
            value={filters.year_max}
            onChange={e => setFilters(f => ({ ...f, year_max: e.target.value }))}
            onBlur={() => apply(filters)}
            className={styles.rangeInput}
          />
        </div>
      </FilterGroup>

      <FilterGroup title={l.fuel}>
        <select value={filters.fuel_type} onChange={e => set('fuel_type', e.target.value)} className={styles.select}>
          <option value="">{l.all}</option>
          <option value="petrol">Petrol</option>
          <option value="diesel">Diesel</option>
          <option value="electric">Electric</option>
          <option value="hybrid">Hybrid</option>
        </select>
      </FilterGroup>

      <FilterGroup title={l.drive}>
        <select value={filters.drive_type} onChange={e => set('drive_type', e.target.value)} className={styles.select}>
          <option value="">{l.all}</option>
          <option value="outboard">Outboard</option>
          <option value="inboard">Inboard</option>
          <option value="sterndrive">Sterndrive</option>
          <option value="jet">Jet</option>
        </select>
      </FilterGroup>

      <FilterGroup title={l.hull}>
        <select value={filters.hull_material} onChange={e => set('hull_material', e.target.value)} className={styles.select}>
          <option value="">{l.all}</option>
          <option value="grp">GRP / Fibreglass</option>
          <option value="rib">RIB</option>
          <option value="aluminium">Aluminium</option>
          <option value="steel">Steel</option>
          <option value="wood">Wood</option>
          <option value="carbon">Carbon Fibre</option>
        </select>
      </FilterGroup>
    </div>
  )
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className={styles.group}>
      <h4 className={styles.groupTitle}>{title}</h4>
      {children}
    </div>
  )
}
