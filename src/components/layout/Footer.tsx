import Link from 'next/link'
import type { Locale } from '@/lib/locale'
import { getTranslations } from '@/lib/translations'
import styles from './Footer.module.css'

const FOOTER_TRANSLATIONS: Record<string, string> = {
  'About Us': 'Sobre Nós',
  'Services': 'Serviços',
  'Indoor Storage': 'Armazenamento Interior',
  'Maintenance': 'Manutenção',
  'Sell Your Boat': 'Vender o Seu Barco',
  'Terms & Conditions': 'Termos e Condições',
  'Privacy Policy': 'Política de Privacidade',
}

interface NavItem {
  label: string
  link: string
  open_in_new_tab?: boolean
}

interface FooterProps {
  locale: Locale
  navItems: NavItem[]
  siteSettings?: any
}

export function Footer({ locale, navItems, siteSettings }: FooterProps) {
  const t = getTranslations(locale)
  const siteName = siteSettings?.site_name || 'Algarve Boat Sales'
  const email = siteSettings?.contact_email || 'info@algarveboatsales.com'
  const phone = siteSettings?.contact_phone || '(+351) 282 045 109'
  const whatsapp = siteSettings?.whatsapp_number || '+351963692451'

  // Split navItems into two columns
  const mid = Math.ceil(navItems.length / 2)
  const col1 = navItems.slice(0, mid)
  const col2 = navItems.slice(mid)

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          {/* Brand column */}
          <div className={styles.brand}>
            <div className={styles.logo}>
              <span>Algarve</span>
              <span className="text-gold"> Boat Sales</span>
            </div>
            <p>{t('footer_tagline')}</p>
            <div className={styles.contact}>
              <p>📍 Marina de Lagos, Loja 11, Lagos</p>
              {phone && <p>📞 <a href={`tel:${phone.replace(/\s/g,'')}`}>{phone}</a></p>}
              {email && <p>✉️ <a href={`mailto:${email}`}>{email}</a></p>}
              {whatsapp && <p>💬 <a href={`https://wa.me/${whatsapp.replace(/[^0-9]/g,'')}`}>WhatsApp</a></p>}
            </div>
          </div>

          {/* Boats column */}
          <div className={styles.links}>
            <h4>{t('footer_boats')}</h4>
            <ul>
              <li><Link href="/boats">{t('footer_all')}</Link></li>
              <li><Link href="/boats?condition=new">{t('footer_new')}</Link></li>
              <li><Link href="/boats?condition=used">{t('footer_used')}</Link></li>
              <li><Link href="/trailers">{t('footer_trailers')}</Link></li>
              <li><Link href="/brands">{t('footer_our_brands')}</Link></li>
            </ul>
          </div>

          {/* Pages col 1 from CMS */}
          {col1.length > 0 && (
            <div className={styles.links}>
              <h4>{t('footer_services')}</h4>
              <ul>
                {col1.map(item => (
                  <li key={item.link}>
                    <Link href={item.link} target={item.open_in_new_tab ? '_blank' : undefined}>
                      {locale === 'pt' ? (FOOTER_TRANSLATIONS[item.label] || item.label) : item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Pages col 2 from CMS */}
          {col2.length > 0 && (
            <div className={styles.links}>
              <h4>{t('footer_company')}</h4>
              <ul>
                {col2.map(item => (
                  <li key={item.link}>
                    <Link href={item.link} target={item.open_in_new_tab ? '_blank' : undefined}>
                      {locale === 'pt' ? (FOOTER_TRANSLATIONS[item.label] || item.label) : item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className={styles.bottom}>
          <p>© {new Date().getFullYear()} {siteName}. {t('footer_rights')} | Marina de Lagos, Portugal</p>
        </div>
      </div>
    </footer>
  )
}
