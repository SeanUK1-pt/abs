'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { setLocale } from '@/app/actions/locale'
import styles from './Header.module.css'

type Locale = 'en' | 'pt'

// Services dropdown labels by locale (defined in code, not CMS)
const SERVICES_DROPDOWN: Record<Locale, { label: string; href: string }[]> = {
  en: [
    { label: 'All Services', href: '/services' },
    { label: 'Maintenance', href: '/maintenance' },
    { label: 'Indoor Storage', href: '/boat-storage' },
    { label: 'Sell Your Boat', href: '/sell-your-boat' },
  ],
  pt: [
    { label: 'Todos os Serviços', href: '/services' },
    { label: 'Manutenção', href: '/maintenance' },
    { label: 'Armazenamento Interior', href: '/boat-storage' },
    { label: 'Vender o Seu Barco', href: '/sell-your-boat' },
  ],
}

const ENQUIRE: Record<Locale, string> = {
  en: 'Enquire Now',
  pt: 'Pedir Informações',
}

// Translate EN nav labels to PT
const NAV_TRANSLATIONS: Record<string, string> = {
  'Boats': 'Barcos',
  'Trailers': 'Reboques',
  'Services': 'Serviços',
  'Brands': 'Marcas',
  'About': 'Sobre Nós',
  'Contact': 'Contacto',
}

interface NavItem {
  label: string
  link: string
  open_in_new_tab?: boolean
}

interface HeaderProps {
  locale: Locale
  navItems: NavItem[]
  siteSettings?: any
}

export function Header({ locale, navItems, siteSettings }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const servicesDropdown = SERVICES_DROPDOWN[locale] || SERVICES_DROPDOWN.en
  const siteName = siteSettings?.site_name || 'Algarve Boat Sales'

  function handleLocaleChange(newLocale: Locale) {
    startTransition(async () => {
      await setLocale(newLocale)
      router.refresh()
    })
  }

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.logo} onClick={() => setMobileOpen(false)}>
          <Image
            src="/media/ABS-logo-vector_white.png"
            alt="Algarve Boat Sales"
            width={946}
            height={191}
            className={styles.logoImg}
            priority
          />
        </Link>

        <nav className={`${styles.nav} ${mobileOpen ? styles.navOpen : ''}`}>
          {navItems.map(item => {
            // Attach dropdown to the Services link
            const isServices = item.link === '/services'
            const isOpen = openDropdown === 'services'
            return (
              <div
                key={item.link}
                className={styles.navItem}
                onMouseEnter={() => isServices && setOpenDropdown('services')}
                onMouseLeave={() => isServices && setOpenDropdown(null)}
              >
                <div className={styles.navLinkRow}>
                  <Link
                    href={item.link}
                    className={styles.navLink}
                    target={item.open_in_new_tab ? '_blank' : undefined}
                    onClick={() => setMobileOpen(false)}
                  >
                    {locale === 'pt' ? (NAV_TRANSLATIONS[item.label] || item.label) : item.label}
                  </Link>
                  {isServices && (
                    <button
                      type="button"
                      className={`${styles.caretBtn} ${isOpen ? styles.caretOpen : ''}`}
                      aria-label={isOpen ? 'Close services menu' : 'Open services menu'}
                      aria-expanded={isOpen}
                      onClick={(e) => {
                        e.preventDefault()
                        setOpenDropdown(isOpen ? null : 'services')
                      }}
                    >
                      <span className={styles.caret}>▾</span>
                    </button>
                  )}
                </div>

                {isServices && isOpen && (
                  <div className={styles.dropdown}>
                    {servicesDropdown.map(child => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={styles.dropdownLink}
                        onClick={() => { setMobileOpen(false); setOpenDropdown(null) }}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        <div className={styles.actions}>
          <div className={styles.langSwitch}>
            <button
              onClick={() => handleLocaleChange('en')}
              className={`${styles.langBtn} ${locale === 'en' ? styles.langActive : ''}`}
              disabled={isPending}
              aria-label="English"
            >EN</button>
            <span className={styles.langDivider}>|</span>
            <button
              onClick={() => handleLocaleChange('pt')}
              className={`${styles.langBtn} ${locale === 'pt' ? styles.langActive : ''}`}
              disabled={isPending}
              aria-label="Português"
            >PT</button>
          </div>

          <Link href="/contact" className={`btn btn-gold ${styles.enquireBtn}`}>
            {ENQUIRE[locale]}
          </Link>

          <button
            className={styles.menuBtn}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  )
}
