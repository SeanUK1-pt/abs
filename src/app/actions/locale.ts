'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { isValidLocale } from '@/lib/locale'

export async function setLocale(locale: string) {
  if (!isValidLocale(locale)) return
  const cookieStore = await cookies()
  cookieStore.set('locale', locale, {
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: '/',
  })
  revalidatePath('/', 'layout')
}
