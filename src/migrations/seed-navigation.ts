/**
 * Seeds Main Navigation and Footer Navigation globals + Site Settings.
 * Run: DATABASE_URI=... PAYLOAD_SECRET=... npx tsx src/migrations/seed-navigation.ts
 */
import { getPayload } from 'payload'
import config from '../payload.config'

async function seed() {
  const payload = await getPayload({ config })

  // ── Main Navigation (labels in English; Header component translates them)
  await payload.updateGlobal({
    slug: 'main-navigation',
    data: {
      items: [
        { label: 'Boats', link: '/boats', open_in_new_tab: false },
        { label: 'Trailers', link: '/trailers', open_in_new_tab: false },
        { label: 'Services', link: '/services', open_in_new_tab: false },
        { label: 'Brands', link: '/brands', open_in_new_tab: false },
        { label: 'About', link: '/about', open_in_new_tab: false },
        { label: 'Contact', link: '/contact', open_in_new_tab: false },
      ],
    },
  })
  console.log('✅ Main Navigation seeded')

  // ── Footer Navigation ─────────────────────────────────────────────────
  await payload.updateGlobal({
    slug: 'footer-navigation',
    data: {
      items: [
        { label: 'About Us', link: '/about', open_in_new_tab: false },
        { label: 'Services', link: '/services', open_in_new_tab: false },
        { label: 'Indoor Storage', link: '/boat-storage', open_in_new_tab: false },
        { label: 'Maintenance', link: '/maintenance', open_in_new_tab: false },
        { label: 'Sell Your Boat', link: '/sell-your-boat', open_in_new_tab: false },
        { label: 'Terms & Conditions', link: '/terms-and-conditions', open_in_new_tab: false },
        { label: 'Privacy Policy', link: '/privacy-policy', open_in_new_tab: false },
      ],
    },
  })
  console.log('✅ Footer Navigation seeded')

  // ── Site Settings ─────────────────────────────────────────────────────
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      site_name: 'Algarve Boat Sales',
      contact_email: 'info@algarveboatsales.com',
      contact_phone: '(+351) 282 045 109',
      whatsapp_number: '+351963692451',
      google_maps_url: 'https://maps.google.com/?q=Marina+de+Lagos',
      facebook_url: 'https://facebook.com/algarveboatsales',
      instagram_url: 'https://instagram.com/algarveboatsales',
    },
  })
  console.log('✅ Site Settings seeded')

  console.log('\nAll done.')
  process.exit(0)
}

seed().catch(e => { console.error(e); process.exit(1) })
