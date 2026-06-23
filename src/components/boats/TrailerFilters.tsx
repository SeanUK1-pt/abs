'use client'

import { useRouter, usePathname } from 'next/navigation'

export function TrailerFilters({
  currentCondition,
  currentPriceMax,
}: {
  currentCondition?: string
  currentPriceMax?: string
}) {
  const router = useRouter()
  const pathname = usePathname()

  function update(key: string, value: string) {
    const params = new URLSearchParams(window.location.search)
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div style={{ display: 'flex', gap: '0.75rem' }}>
      <select
        value={currentCondition || ''}
        onChange={e => update('condition', e.target.value)}
        style={{ padding: '0.6rem 1rem', border: '2px solid #dee2e6', borderRadius: '4px', fontSize: '0.9rem' }}
      >
        <option value="">All Conditions</option>
        <option value="new">New</option>
        <option value="used">Used</option>
      </select>

      <select
        value={currentPriceMax || ''}
        onChange={e => update('price_max', e.target.value)}
        style={{ padding: '0.6rem 1rem', border: '2px solid #dee2e6', borderRadius: '4px', fontSize: '0.9rem' }}
      >
        <option value="">Max Price</option>
        <option value="5000">€5,000</option>
        <option value="10000">€10,000</option>
        <option value="20000">€20,000</option>
      </select>
    </div>
  )
}
