'use client'
import { useState, useEffect, useCallback } from 'react'

const KEY = 'abs_favourites'
const MAX_AGE = 365 * 24 * 60 * 60 // 1 year

function readCookie(): string[] {
  if (typeof document === 'undefined') return []
  const match = document.cookie.match(/(?:^|;\s*)abs_favourites=([^;]*)/)
  if (!match) return []
  try {
    return JSON.parse(decodeURIComponent(match[1]))
  } catch {
    return []
  }
}

function writeCookie(ids: string[]) {
  document.cookie = `${KEY}=${encodeURIComponent(JSON.stringify(ids))}; path=/; max-age=${MAX_AGE}; SameSite=Lax`
}

export function useFavourites() {
  const [ids, setIds] = useState<string[]>([])

  useEffect(() => {
    setIds(readCookie())
  }, [])

  const toggle = useCallback((id: string) => {
    setIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
      writeCookie(next)
      return next
    })
  }, [])

  const has = useCallback((id: string) => ids.includes(id), [ids])

  return { ids, toggle, has, count: ids.length }
}
