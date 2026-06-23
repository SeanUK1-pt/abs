import { cookies } from 'next/headers'

export type Locale = 'en' | 'pt'

export const LOCALES: Locale[] = ['en', 'pt']
export const DEFAULT_LOCALE: Locale = 'en'

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies()
  const locale = cookieStore.get('locale')?.value
  return (locale as Locale) || DEFAULT_LOCALE
}

export function isValidLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale)
}
