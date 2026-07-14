export type Locale = 'en' | 'pt'
export const LOCALES: Locale[] = ['en', 'pt']
export const DEFAULT_LOCALE: Locale = 'en'

export function getLocaleFromParam(param: string | undefined): Locale {
  return param === 'pt' ? 'pt' : 'en'
}
