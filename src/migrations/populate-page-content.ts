/**
 * Populates the Pages collection content fields with the actual page text,
 * so editors can see and edit real content in the Payload admin.
 * Run: DATABASE_URI=... PAYLOAD_SECRET=... npx tsx src/migrations/populate-page-content.ts
 */
import { getPayload } from 'payload'
import config from '../payload.config'

// Helper to build a simple Lexical document from paragraphs and headings
function doc(...nodes: Array<{ type: 'h2' | 'h3' | 'p' | 'ul'; text?: string; items?: string[] }>) {
  const children = nodes.map(node => {
    if (node.type === 'ul') {
      return {
        children: (node.items || []).map(item => ({
          children: [{ detail: 0, format: 0, mode: 'normal', style: '', text: item, type: 'text', version: 1 }],
          direction: 'ltr', format: '', indent: 0, type: 'listitem', version: 1, value: 1,
        })),
        direction: 'ltr', format: '', indent: 0, listType: 'bullet', start: 1, type: 'list', version: 1, tag: 'ul',
      }
    }
    const tag = node.type === 'h2' ? 'h2' : node.type === 'h3' ? 'h3' : 'paragraph'
    return {
      children: [{ detail: 0, format: 0, mode: 'normal', style: '', text: node.text || '', type: 'text', version: 1 }],
      direction: 'ltr', format: '', indent: 0, type: node.type.startsWith('h') ? 'heading' : 'paragraph',
      version: 1, ...(node.type.startsWith('h') ? { tag } : {}),
    }
  })
  return { root: { children, direction: 'ltr', format: '', indent: 0, type: 'root', version: 1 } }
}

const PAGE_CONTENT: Record<string, { en: any; pt: any }> = {
  about: {
    en: doc(
      { type: 'h2', text: 'Who We Are' },
      { type: 'p', text: 'Algarve Boat Sales is a premium boat dealership based at Marina de Lagos, in the heart of the Algarve. We specialise in the sale of new and pre-owned recreational boats, trailers, and marine accessories — bringing together the best brands and the best service under one roof.' },
      { type: 'p', text: 'Our mission is simple: to provide unforgettable maritime experiences. Whether you\'re buying your first boat, upgrading to something bigger, or selling a vessel you\'ve loved, our skilled and friendly team is here to make the process as straightforward and enjoyable as possible.' },
      { type: 'h2', text: 'Our Location' },
      { type: 'p', text: 'You\'ll find us on the ground floor of Marina de Lagos (Loja 11), right next to the Artesão bar and café. We\'re open Monday to Friday, 9am to 5pm.' },
    ),
    pt: doc(
      { type: 'h2', text: 'Quem Somos' },
      { type: 'p', text: 'A Algarve Boat Sales é uma concessionária de barcos premium situada na Marina de Lagos, no coração do Algarve. Especializamo-nos na venda de barcos recreativos novos e usados, reboques e acessórios náuticos.' },
      { type: 'p', text: 'A nossa missão é simples: proporcionar experiências marítimas inesquecíveis. Quer esteja a comprar o seu primeiro barco, a fazer um upgrade ou a vender, a nossa equipa está aqui para tornar o processo o mais simples e agradável possível.' },
      { type: 'h2', text: 'A Nossa Localização' },
      { type: 'p', text: 'Encontra-nos no rés-do-chão da Marina de Lagos (Loja 11), mesmo ao lado do bar e café Artesão. Estamos abertos de segunda a sexta, das 9h às 17h.' },
    ),
  },

  services: {
    en: doc(
      { type: 'h2', text: 'Specialized Boat Services' },
      { type: 'p', text: 'Welcome to Algarve Boat Sales! Our mission is to provide unforgettable maritime experiences. Whether you\'re buying or selling a boat, needing an engine service, help navigating paperwork or finding the best accessories, we have you covered.' },
      { type: 'p', text: 'Our skilled and friendly crew can help with anything you need, providing practical and hassle-free solutions so that you can spend your time enjoying the most of your boat, out on the water.' },
      { type: 'ul', items: ['Boat Sales & Brokerage', 'Boat Trailer Supply', 'Indoor & Outdoor Storage', 'Hull Repair & Gel Coat', 'Engine Servicing', 'Paperwork & Registration'] },
    ),
    pt: doc(
      { type: 'h2', text: 'Serviços Náuticos Especializados' },
      { type: 'p', text: 'Bem-vindo à Algarve Boat Sales! A nossa missão é proporcionar experiências marítimas inesquecíveis. Quer esteja a comprar ou a vender um barco, a precisar de serviço de motor, ajuda com papelada ou a encontrar os melhores acessórios, nós tratamos de tudo.' },
      { type: 'ul', items: ['Venda e Corretagem de Barcos', 'Fornecimento de Reboques', 'Armazenamento Interior e Exterior', 'Reparação de Casco e Gel Coat', 'Serviço de Motores', 'Papelada e Registo'] },
    ),
  },

  brands: {
    en: doc(
      { type: 'h2', text: 'Our Exclusive Brands' },
      { type: 'p', text: 'We are the authorised Algarve dealer for some of the world\'s finest boat and trailer manufacturers. Every brand in our portfolio has been chosen for their commitment to quality, innovation, and after-sales support.' },
      { type: 'p', text: 'As authorised dealers, we can offer factory-direct ordering, full manufacturer warranties, and access to genuine spare parts and accessories for every brand we carry.' },
    ),
    pt: doc(
      { type: 'h2', text: 'As Nossas Marcas Exclusivas' },
      { type: 'p', text: 'Somos o concessionário autorizado no Algarve para alguns dos melhores fabricantes de barcos e reboques do mundo. Cada marca no nosso portfólio foi escolhida pelo seu compromisso com a qualidade, inovação e apoio pós-venda.' },
    ),
  },

  'boat-storage': {
    en: doc(
      { type: 'h2', text: 'Safe, Secure Winter Storage' },
      { type: 'p', text: 'We offer complete winter storage packages that include everything you need to put your boat away safely for the winter and bring it back out ready for the season. Available for boats up to 10m / 30ft.' },
      { type: 'p', text: 'Our facility is secure, covered, and monitored — giving you peace of mind throughout the off-season. We\'ve been looking after boats in the Algarve for years and understand exactly what\'s needed to keep your vessel in perfect condition.' },
      { type: 'h2', text: 'How to Book' },
      { type: 'p', text: 'Spaces are limited and we typically fill up before October. Contact us as early as possible to reserve your space for the coming winter.' },
    ),
    pt: doc(
      { type: 'h2', text: 'Armazenamento de Inverno Seguro' },
      { type: 'p', text: 'Oferecemos pacotes completos de armazenamento de inverno que incluem tudo o que precisa para guardar o seu barco em segurança durante o inverno e trazê-lo de volta pronto para a temporada. Disponível para barcos até 10m / 30ft.' },
    ),
  },

  maintenance: {
    en: doc(
      { type: 'h2', text: 'Nautical Care & Upkeep' },
      { type: 'p', text: 'Our daily and seasonal care programs include cleaning, polishing, mechanical checkups, and system testing to help owners maintain their boats in top condition year-round.' },
      { type: 'p', text: 'We have a team that specializes in comprehensive boat renovation — combining craftsmanship, advanced technology, and marine expertise to restore and upgrade every aspect of your vessel. Whether you\'re looking to bring an older boat back to life or simply maintain a new one in showroom condition, we have the skills and experience to help.' },
    ),
    pt: doc(
      { type: 'h2', text: 'Cuidado e Manutenção Náutica' },
      { type: 'p', text: 'Os nossos programas diários e sazonais incluem limpeza, polimento, verificações mecânicas e testes de sistemas para ajudar os proprietários a manter os seus barcos em excelente condição durante todo o ano.' },
    ),
  },

  'sell-your-boat': {
    en: doc(
      { type: 'h2', text: 'Free, No-Obligation Valuation' },
      { type: 'p', text: 'Looking to sell your boat? Let us do the hard work. Algarve Boat Sales has an established network of qualified buyers and a strong online presence — meaning your boat gets seen by the right people, fast.' },
      { type: 'p', text: 'Fill in the valuation form and we\'ll get back to you within 48 hours with a realistic market assessment. From there, it\'s entirely your decision — no pressure, no obligation.' },
      { type: 'h2', text: 'What\'s Included' },
      { type: 'ul', items: ['Free market valuation within 48 hours', 'Professional photography', 'Listing on our website', 'Viewings and sea trials managed for you', 'Negotiation on your behalf', 'Secure payment handling', 'Paperwork assistance'] },
    ),
    pt: doc(
      { type: 'h2', text: 'Avaliação Gratuita e Sem Compromisso' },
      { type: 'p', text: 'Quer vender o seu barco? A Algarve Boat Sales tem uma rede estabelecida de compradores qualificados e uma forte presença online — o que significa que o seu barco é visto pelas pessoas certas rapidamente.' },
    ),
  },

  'terms-and-conditions': {
    en: doc(
      { type: 'p', text: 'Welcome to algarveboatsales.com. These terms and conditions outline the rules and regulations for the use of the Algarve Boat Sales website. By accessing this website we assume you accept these terms and conditions.' },
      { type: 'h2', text: 'Pricing & Listings' },
      { type: 'p', text: 'All prices shown on this website are indicative and subject to change without notice. Algarve Boat Sales reserves the right to withdraw any listing at any time. Prices are shown in Euros (EUR) unless otherwise stated. IVA/VAT status is indicated on each individual listing.' },
      { type: 'h2', text: 'Contact' },
      { type: 'p', text: 'If you have any questions about these Terms & Conditions, please contact us at info@algarveboatsales.com.' },
    ),
    pt: doc(
      { type: 'p', text: 'Bem-vindo ao algarveboatsales.com. Estes termos e condições descrevem as regras e regulamentos para a utilização do website da Algarve Boat Sales. Ao aceder a este website, assume que aceita estes termos e condições.' },
    ),
  },

  'privacy-policy': {
    en: doc(
      { type: 'p', text: 'Algarve Boat Sales is committed to protecting your privacy. This policy explains how we collect, use and protect your personal data when you use our website or contact us.' },
      { type: 'h2', text: 'Data We Collect' },
      { type: 'p', text: 'We collect information you provide when submitting enquiry forms, contacting us directly, or requesting a boat valuation. This includes your name, email address, phone number, and the content of your message.' },
      { type: 'h2', text: 'How We Use Your Data' },
      { type: 'p', text: 'We use your data only to respond to your enquiries and provide the services you have requested. We do not sell or share your data with third parties for marketing purposes.' },
      { type: 'h2', text: 'Your Rights' },
      { type: 'p', text: 'Under GDPR you have the right to access, correct, or delete your personal data at any time. Please contact info@algarveboatsales.com to exercise these rights.' },
    ),
    pt: doc(
      { type: 'p', text: 'A Algarve Boat Sales está empenhada em proteger a sua privacidade. Esta política explica como recolhemos, utilizamos e protegemos os seus dados pessoais quando utiliza o nosso website ou nos contacta.' },
    ),
  },
}

async function run() {
  const payload = await getPayload({ config })
  let updated = 0

  for (const [slug, content] of Object.entries(PAGE_CONTENT)) {
    const { docs } = await payload.find({ collection: 'pages', where: { slug: { equals: slug } }, limit: 1 })
    const page = docs[0] as any
    if (!page) { console.log(`⚠️  Not found: ${slug}`); continue }

    // Set EN content
    await payload.update({ collection: 'pages', id: page.id, data: { content: content.en }, locale: 'en' as any })
    // Set PT content
    await payload.update({ collection: 'pages', id: page.id, data: { content: content.pt }, locale: 'pt' as any })

    console.log(`✅ ${slug}`)
    updated++
  }

  console.log(`\nDone. Updated ${updated} pages.`)
  process.exit(0)
}

run().catch(e => { console.error(e); process.exit(1) })
