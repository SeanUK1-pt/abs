'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useState, useCallback } from 'react'
import { BOAT_TYPES, HULL_MATERIALS } from '@/lib/boatTypes'
import styles from './FilterSidebar.module.css'

const L: Record<string, Record<string, string>> = {
  en: { filters: 'Filters', clear_all: 'Clear all', condition: 'Condition', type: 'Boat Type', make: 'Make', price: 'Price (€)', length: 'Length (m)', year: 'Year', fuel: 'Fuel Type', drive: 'Drive Type', hull: 'Hull Material', poa: 'Include Price on Application', new: 'New', used: 'Used', all_types: 'All Types', all_makes: 'All Makes', all: 'All' },
  pt: { filters: 'Filtros', clear_all: 'Limpar tudo', condition: 'Estado', type: 'Tipo de Barco', make: 'Marca', price: 'Preço (€)', length: 'Comprimento (m)', year: 'Ano', fuel: 'Combustível', drive: 'Propulsão', hull: 'Material do Casco', poa: 'Incluir Preço sob consulta', new: 'Novo', used: 'Usado', all_types: 'Todos os Tipos', all_makes: 'Todas as Marcas', all: 'Todos' },
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
  // Ticked by default; only an explicit poa=0 in the URL turns it off.
  const [includePoa, setIncludePoa] = useState(searchParams.poa !== '0')

  const apply = useCallback((updated: typeof filters, poa: boolean = includePoa) => {
    const params = new URLSearchParams()
    Object.entries(updated).forEach(([k, v]) => { if (v) params.set(k, v) })
    if (!poa) params.set('poa', '0')
    router.push(`${pathname}?${params.toString()}`)
  }, [pathname, router, includePoa])

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
    setIncludePoa(true)
    router.push(pathname)
  }

  const hasFilters = Object.values(filters).some(Boolean) || !includePoa
  const activeCount = Object.values(filters).filter(Boolean).length + (includePoa ? 0 : 1)
  const [open, setOpen] = useState(false)

  return (
    <div className={styles.wrap}>
      {/* Mobile-only toggle — keeps results near the top until filters are needed */}
      <button
        type="button"
        className={styles.mobileToggle}
        aria-expanded={open}
        aria-controls="filter-body"
        onClick={() => setOpen(o => !o)}
      >
        <span className={styles.mobileToggleLabel}>
          {l.filters}
          {activeCount > 0 && <span className={styles.activeCount}>{activeCount}</span>}
        </span>
        <svg
          className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}
          width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <div id="filter-body" className={`${styles.sidebar} ${open ? styles.sidebarOpen : ''}`}>
        <div className={styles.header}>
          <h3>{l.filters}</h3>
          {hasFilters && <button onClick={clear} className={styles.clearBtn}>{l.clear_all}</button>}
        </div>

      <FilterGroup title={l.condition}>
        <div className={styles.segmented}>
          {['new', 'used'].map(v => (
            <label
              key={v}
              className={`${styles.segmentLabel} ${filters.condition === v ? styles.segmentActive : ''}`}
            >
              <input
                type="radio"
                name="condition"
                value={v}
                checked={filters.condition === v}
                onChange={() => set('condition', v)}
              />
              <span>{v === 'new' ? l.new : l.used}</span>
            </label>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title={l.type}>
        <select value={filters.boat_type} onChange={e => set('boat_type', e.target.value)} className={styles.select}>
          <option value="">{l.all_types}</option>
          {BOAT_TYPES.map(o => (
            <option key={o.value} value={o.value}>{locale === 'pt' ? o.pt : o.en}</option>
          ))}
        </select>
      </FilterGroup>

      <FilterGroup title={l.hull}>
        <select value={filters.hull_material} onChange={e => set('hull_material', e.target.value)} className={styles.select}>
          <option value="">{l.all}</option>
          {HULL_MATERIALS.map(o => (
            <option key={o.value} value={o.value}>{locale === 'pt' ? o.pt : o.en}</option>
          ))}
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
        <label className={styles.checkLabel}>
          <input
            type="checkbox"
            checked={includePoa}
            onChange={e => { setIncludePoa(e.target.checked); apply(filters, e.target.checked) }}
          />
          <span>{l.poa}</span>
        </label>
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

      </div>
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
