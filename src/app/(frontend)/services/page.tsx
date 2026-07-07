import Link from 'next/link'
import Image from 'next/image'
import styles from './services.module.css'
import { getLocale } from '@/lib/locale'
import { getPageData } from '@/lib/getPage'
import { PageHero } from '@/components/ui/PageHero'
import { getTranslations } from '@/lib/translations'

const SERVICES = {
  en: [
    {
      title: 'Boat Sales & Brokerage',
      slug: '/boats',
      cta: 'Browse Our Boats',
      image: '/services/sales.jpg',
      imageAlt: 'A sleek motorboat moored at a sunny Algarve marina',
      description:
        "We offer an extensive range of new and pre-owned boats from the world's leading manufacturers, and a hassle-free brokerage service if you're selling. Our team guides you through the entire process — from first viewing and sea trial to registration, handover, or a free valuation.",
      features: ['New boat orders direct from factory', 'Pre-owned boat inspections', 'Part-exchange welcome', 'Sea trials arranged', 'Free brokerage valuations', 'Registration assistance'],
    },
    {
      title: 'Maintenance & Servicing',
      slug: 'maintenance',
      image: '/services/maintenance.jpg',
      imageAlt: 'A marine engineer servicing a boat outboard engine',
      description: 'Our certified engineers and experienced craftspeople provide comprehensive maintenance programmes to keep your boat performing at its best, season after season.',
      features: ['Annual engine servicing', 'Anode replacement', 'Hull cleaning & antifouling', 'Gel coat repair', 'Electrical systems', 'Full pre-season preparation'],
    },
    {
      title: 'Indoor Boat Storage',
      slug: 'boat-storage',
      image: '/services/storage.jpg',
      imageAlt: 'Boats stored on stands inside a covered indoor storage facility',
      description: 'Secure, covered storage for boats up to 10m/30ft. Our winter storage packages include full preparation on the way in and a thorough pre-season handback service.',
      features: ['Jet-wash on arrival', 'Engine winterisation by certified engineer', 'Secure covered facility', 'Pre-season cleaning & polish', 'Anode check & replacement', 'Delivery & collection available'],
    },
    {
      title: 'Trailer Supply',
      slug: '/trailers',
      image: '/services/trailer.jpg',
      imageAlt: 'A stainless steel boat trailer with a RIB loaded on it',
      description: "We supply and fit Vanclaes branded trailers — one of Europe's leading trailer manufacturers — sized precisely for your vessel.",
      features: ['Stainless steel construction', 'Braked and un-braked options', 'IVA registration assistance', 'Delivery throughout Portugal'],
    },
    {
      title: 'Paperwork & Licensing',
      slug: '#paperwork',
      image: '/services/paperwork.jpg',
      imageAlt: 'Boat registration documents and nautical charts on a desk',
      description: 'Navigating Portuguese maritime bureaucracy can be complex. We help you with everything from vessel registration and CE certification to licence requirements.',
      features: ['Vessel registration (DGRM)', 'CE category documentation', 'Import / customs assistance', 'Insurance referrals'],
    },
  ],
  pt: [
    {
      title: 'Compra e Venda de Barcos',
      slug: '/boats',
      cta: 'Ver os Nossos Barcos',
      image: '/services/sales.jpg',
      imageAlt: 'Uma lancha elegante atracada numa marina ensolarada do Algarve',
      description:
        'Oferecemos uma extensa gama de barcos novos e usados dos principais fabricantes mundiais, e um serviço de mediação sem complicações para quem quer vender. A nossa equipa acompanha-o em todo o processo — desde a primeira visita e prova no mar até ao registo, entrega ou avaliação gratuita.',
      features: ['Encomendas de barcos novos direto de fábrica', 'Inspeção de barcos usados', 'Retoma aceite', 'Provas no mar disponíveis', 'Avaliações de mediação gratuitas', 'Apoio ao registo'],
    },
    {
      title: 'Manutenção e Assistência',
      slug: 'maintenance',
      image: '/services/maintenance.jpg',
      imageAlt: 'Um engenheiro naval a efetuar manutenção num motor de barco',
      description: 'Os nossos engenheiros certificados e artesãos experientes oferecem programas de manutenção abrangentes para manter o seu barco no melhor desempenho, época após época.',
      features: ['Revisão anual do motor', 'Substituição de ânodos', 'Limpeza do casco e antivegetativa', 'Reparação de gel coat', 'Sistemas elétricos', 'Preparação completa pré-época'],
    },
    {
      title: 'Armazenamento Interior de Barcos',
      slug: 'boat-storage',
      image: '/services/storage.jpg',
      imageAlt: 'Barcos armazenados em suportes dentro de uma instalação coberta',
      description: 'Armazenamento seguro e coberto para barcos até 10m. Os nossos pacotes de armazenamento de inverno incluem preparação completa na entrada e um serviço rigoroso de entrega pré-época.',
      features: ['Lavagem de alta pressão à chegada', 'Invernagem do motor por engenheiro certificado', 'Instalação coberta e segura', 'Limpeza e polimento pré-época', 'Verificação e substituição de ânodos', 'Transporte disponível'],
    },
    {
      title: 'Fornecimento de Reboques',
      slug: '/trailers',
      image: '/services/trailer.jpg',
      imageAlt: 'Um reboque em aço inoxidável com um RIB carregado',
      description: 'Fornecemos e montamos reboques da marca Vanclaes — um dos principais fabricantes de reboques da Europa — dimensionados com precisão para a sua embarcação.',
      features: ['Construção em aço inoxidável', 'Opções com e sem travão', 'Apoio ao registo IVA', 'Entrega em todo Portugal'],
    },
    {
      title: 'Documentação e Licenciamento',
      slug: '#paperwork',
      image: '/services/paperwork.jpg',
      imageAlt: 'Documentos de registo de embarcação e cartas náuticas numa secretária',
      description: 'Navegar na burocracia marítima portuguesa pode ser complexo. Ajudamo-lo em tudo, desde o registo da embarcação e certificação CE até aos requisitos de licença.',
      features: ['Registo de embarcação (DGRM)', 'Documentação de categoria CE', 'Assistência em importação / alfândega', 'Referências de seguros'],
    },
  ],
}

export async function generateMetadata() {
  const locale = await getLocale()
  const page = await getPageData('services', locale)
  const t = getTranslations(locale)
  return {
    title: page?.title ? `${page.title} | Algarve Boat Sales` : `${t('services_title')} | Algarve Boat Sales`,
    description: page?.meta_description || 'Boat sales, maintenance, storage, and trailer services in Lagos, Algarve.',
  }
}

export default async function ServicesPage() {
  const locale = await getLocale()
  const t = getTranslations(locale)
  const services = SERVICES[locale]
  const [featured, ...rest] = services

  return (
    <>
      <PageHero
        title={t('services_title')}
        subtitle={t('services_subtitle')}
        imageSrc="/media/20250127_140618-scaled.jpg"
        imageAlt="A GRAND RIB on a trailer inside the Algarve Boat Sales workshop"
      />

      <div className="container">
        <section className={styles.intro}>
          <p>{t('services_intro')}</p>
        </section>

        {/* Featured wide tile breaks up the grid rhythm */}
        <article className={styles.featured} id="sales">
          <div className={styles.featuredMedia}>
            <Image
              src={featured.image}
              alt={featured.imageAlt}
              fill
              sizes="(max-width: 900px) 100vw, 45vw"
              className={styles.mediaImg}
              priority
            />
            <span className={styles.cardIndex}>01</span>
          </div>
          <div className={styles.featuredBody}>
            <span className={styles.eyebrow}>{t('services_eyebrow')}</span>
            <h2 className={styles.featuredTitle}>{featured.title}</h2>
            <p className={styles.desc}>{featured.description}</p>
            <ul className={`${styles.features} ${styles.featuredFeatures}`}>
              {featured.features.map(f => (
                <li key={f}><span className={styles.check}>✓</span>{f}</li>
              ))}
            </ul>
            <div className={styles.featuredActions}>
              <Link href={featured.slug} className="btn btn-gold">{'cta' in featured ? featured.cta : ''}</Link>
              <Link href="/sell-your-boat" className="btn btn-outline">{t('services_sell_boat')}</Link>
            </div>
          </div>
        </article>

        <div className={styles.grid}>
          {rest.map(({ title, slug, image, imageAlt, description, features }, i) => (
            <div key={title} className={styles.card} id={slug.replace('/', '')}>
              <div className={styles.media}>
                <Image
                  src={image}
                  alt={imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className={styles.mediaImg}
                />
                <span className={styles.cardIndex}>{String(i + 2).padStart(2, '0')}</span>
                <h2 className={styles.mediaTitle}>{title}</h2>
              </div>
              <div className={styles.body}>
                <p className={styles.desc}>{description}</p>
                <ul className={styles.features}>
                  {features.map(f => (
                    <li key={f}>
                      <span className={styles.check}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                {slug && !slug.startsWith('#') && (
                  <Link
                    href={slug.startsWith('/') ? slug : `/${slug}`}
                    className={`btn btn-outline ${styles.learnMore}`}
                  >
                    {t('services_learn_more')}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        <section className={styles.cta}>
          <h2>{t('services_cta_title')}</h2>
          <p>{t('services_cta_body')}</p>
          <div className={styles.ctaBtns}>
            <Link href="/contact" className="btn btn-gold">{t('services_contact')}</Link>
            <a href="https://wa.me/351963692451" className="btn btn-outline-white">WhatsApp</a>
          </div>
        </section>
      </div>
    </>
  )
}
