/**
 * Seeds the Pages collection with content from the WordPress site.
 * Run: DATABASE_URI=... PAYLOAD_SECRET=... npx tsx src/migrations/seed-pages.ts
 */
import { getPayload } from 'payload'
import config from '../payload.config'

const PAGES = [
  {
    slug: 'services',
    title: { en: 'Our Services', pt: 'Os Nossos Serviços' },
    meta_description: {
      en: 'Boat sales, maintenance, storage, and trailer services in Lagos, Algarve.',
      pt: 'Venda de barcos, manutenção, armazenamento e reboques em Lagos, Algarve.',
    },
  },
  {
    slug: 'about',
    title: { en: 'About Us', pt: 'Sobre Nós' },
    meta_description: {
      en: 'Learn about Algarve Boat Sales — your premium boat dealer in the Algarve, Portugal.',
      pt: 'Conheça a Algarve Boat Sales — o seu revendedor de barcos premium no Algarve, Portugal.',
    },
  },
  {
    slug: 'brands',
    title: { en: 'Exclusive Brands', pt: 'Marcas Exclusivas' },
    meta_description: {
      en: 'Authorised dealer for GRAND, Yamarin, SPX RIB and more.',
      pt: 'Concessionário autorizado para GRAND, Yamarin, SPX RIB e mais.',
    },
  },
  {
    slug: 'boat-storage',
    title: { en: 'Indoor Boat Storage', pt: 'Armazenamento Interior' },
    meta_description: {
      en: 'Winter and year-round indoor boat storage in Lagos, Algarve. Full service packages available.',
      pt: 'Armazenamento de barcos no inverno e durante todo o ano em Lagos, Algarve.',
    },
  },
  {
    slug: 'maintenance',
    title: { en: 'Boat Maintenance', pt: 'Manutenção de Embarcações' },
    meta_description: {
      en: 'Professional boat maintenance, servicing and renovation in the Algarve.',
      pt: 'Manutenção profissional de embarcações e renovação no Algarve.',
    },
  },
  {
    slug: 'sell-your-boat',
    title: { en: 'Sell Your Boat', pt: 'Vender o Seu Barco' },
    meta_description: {
      en: 'Looking to sell your boat? Get a free valuation from Algarve Boat Sales.',
      pt: 'Quer vender o seu barco? Obtenha uma avaliação gratuita da Algarve Boat Sales.',
    },
  },
  {
    slug: 'terms-and-conditions',
    title: { en: 'Terms & Conditions', pt: 'Termos e Condições' },
    meta_description: {
      en: 'Terms and conditions for use of the Algarve Boat Sales website.',
      pt: 'Termos e condições de utilização do website da Algarve Boat Sales.',
    },
  },
  {
    slug: 'privacy-policy',
    title: { en: 'Privacy Policy', pt: 'Política de Privacidade' },
    meta_description: {
      en: 'Privacy policy for Algarve Boat Sales.',
      pt: 'Política de privacidade da Algarve Boat Sales.',
    },
  },
]

async function seed() {
  const payload = await getPayload({ config })
  let created = 0, skipped = 0

  for (const page of PAGES) {
    const { docs } = await payload.find({
      collection: 'pages',
      where: { slug: { equals: page.slug } },
      limit: 1,
    })
    if (docs.length > 0) { skipped++; continue }

    await payload.create({
      collection: 'pages',
      data: {
        slug: page.slug,
        title: page.title.en,
        meta_description: page.meta_description.en,
      },
      locale: 'en',
    })
    // Update PT locale
    const { docs: [newDoc] } = await payload.find({
      collection: 'pages',
      where: { slug: { equals: page.slug } },
      limit: 1,
    })
    if (newDoc) {
      await payload.update({
        collection: 'pages',
        id: newDoc.id,
        data: {
          title: page.title.pt,
          meta_description: page.meta_description.pt,
        },
        locale: 'pt',
      })
    }
    created++
    console.log(`✅ ${page.slug}`)
  }

  console.log(`\nDone. Created: ${created}, Skipped: ${skipped}`)
  process.exit(0)
}

seed().catch(e => { console.error(e); process.exit(1) })
