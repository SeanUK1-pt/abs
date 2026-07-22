'use client'

import { useRouter, usePathname } from 'next/navigation'
import { getTranslations } from '@/lib/translations'

export function TrailerFilters({
  currentCondition,
  currentPriceMax,
  locale = 'en',
}: {
  currentCondition?: string
  currentPriceMax?: string
  locale?: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const t = getTranslations(locale as any)

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
        <option value="">{t('all_conditions')}</option>
        <option value="new">{t('condition_new')}</option>
        <option value="used">{t('condition_used')}</option>
      </select>

      <select
        value={currentPriceMax || ''}
        onChange={e => update('price_max', e.target.value)}
        style={{ padding: '0.6rem 1rem', border: '2px solid #dee2e6', borderRadius: '4px', fontSize: '0.9rem' }}
      >
        <option value="">{t('max_price')}</option>
        <option value="5000">€5,000</option>
        <option value="10000">€10,000</option>
        <option value="20000">€20,000</option>
      </select>
    </div>
  )
}
