import type { Metadata } from 'next'
import { Inter, Sora } from 'next/font/google'
import '../globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getLocale } from '@/lib/locale'
import { getMainNav, getFooterNav, getSiteSettings } from '@/lib/navigation'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const sora = Sora({ subsets: ['latin'], weight: ['600', '700', '800'], variable: '--font-sora' })

export const metadata: Metadata = {
  title: 'Algarve Boat Sales',
  description: 'Premium boat sales in the Algarve, Portugal',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()
  const [mainNav, footerNav, siteSettings] = await Promise.all([
    getMainNav(locale),
    getFooterNav(locale),
    getSiteSettings(),
  ])

  return (
    <html lang={locale} className={`${inter.variable} ${sora.variable}`}>
      <body className={inter.className}>
        <Header locale={locale} navItems={mainNav} siteSettings={siteSettings} />
        <main>{children}</main>
        <Footer locale={locale} navItems={footerNav} siteSettings={siteSettings} />
      </body>
    </html>
  )
}
