'use client'
import { useState, useEffect, useCallback } from 'react'

const KEY = 'abs_favourites'

function readStorage(): string[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function useFavourites() {
  const [ids, setIds] = useState<string[]>([])

  useEffect(() => {
    setIds(readStorage())
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setIds(readStorage())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const toggle = useCallback((id: string) => {
    setIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
      localStorage.setItem(KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const has = useCallback((id: string) => ids.includes(id), [ids])

  return { ids, toggle, has, count: ids.length }
}
