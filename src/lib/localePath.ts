export function localePath(locale: string, path: string): string {
  return locale === 'pt' ? `/pt${path}` : path
}

export function hreflangAlternates(path: string) {
  const BASE = 'https://www.algarveboatsales.com'
  return {
    'en': `${BASE}${path}`,
    'pt': `${BASE}/pt${path}`,
    'x-default': `${BASE}${path}`,
  }
}
