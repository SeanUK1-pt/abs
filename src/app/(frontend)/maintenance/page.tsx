import Link from 'next/link'
import styles from './maintenance.module.css'
import { getLocale } from '@/lib/locale'
import { getPageData } from '@/lib/getPage'
import { RichText } from '@/components/ui/RichText'
import { PageHero } from '@/components/ui/PageHero'
import { getTranslations } from '@/lib/translations'

const SERVICES = {
  en: [
    {
      title: 'Mechanical Services',
      items: ['Engine tune-ups & oil changes', 'Full system diagnostics', 'Seasonal preparation', 'Emergency repairs', 'All major engine brands'],
    },
    {
      title: 'Mechanical Systems Overhaul',
      items: ['Complete engine inspection & repair', 'Inboard & outboard systems', 'Fuel and cooling system work', 'Hydraulics and electrical installs', 'Preventive diagnostic testing'],
    },
    {
      title: 'Hull Repair & Gel Coat Restoration',
      items: ['Gel coat repair & full respray', 'Osmosis treatment', 'Structural hull repairs', 'Polishing & waxing', 'Cosmetic restoration'],
    },
    {
      title: 'Antifouling & Protective Coating',
      items: ['Antifouling application', 'Bottom paint', 'Protective hull coatings', 'Seasonal recoating', 'Performance-focused finishes'],
    },
    {
      title: 'Certifications & Compliance',
      items: ['Documented, certified workmanship', 'Resale-ready paperwork', 'Charter compliance support', 'Regulatory standards met'],
    },
    {
      title: 'Guardenage & Daily Care',
      items: ['Regular checks while in the Marina', 'Routine cleaning on contract', 'Individual deep cleans', 'Wash-down after every outing'],
    },
  ],
  pt: [
    {
      title: 'Serviços Mecânicos',
      items: ['Afinação de motores e mudança de óleo', 'Diagnóstico completo de sistemas', 'Preparação sazonal', 'Reparações de emergência', 'Todas as principais marcas de motores'],
    },
    {
      title: 'Revisão de Sistemas Mecânicos',
      items: ['Inspeção e reparação completa do motor', 'Sistemas interiores e exteriores', 'Trabalhos no sistema de combustível e arrefecimento', 'Instalações hidráulicas e elétricas', 'Testes de diagnóstico preventivo'],
    },
    {
      title: 'Reparação do Casco e Restauro de Gel Coat',
      items: ['Reparação de gel coat e pintura completa', 'Tratamento de osmose', 'Reparações estruturais do casco', 'Polimento e enceramento', 'Restauro estético'],
    },
    {
      title: 'Antivegetativa e Revestimento Protetor',
      items: ['Aplicação de antivegetativa', 'Tinta de fundo', 'Revestimentos protetores do casco', 'Revestimento sazonal', 'Acabamentos de alto desempenho'],
    },
    {
      title: 'Certificações e Conformidade',
      items: ['Trabalho documentado e certificado', 'Documentação pronta para revenda', 'Apoio a conformidade para charter', 'Cumprimento de normas regulamentares'],
    },
    {
      title: 'Guardenage e Cuidados Diários',
      items: ['Verificações regulares na Marina', 'Limpeza de rotina por contrato', 'Limpezas profundas individuais', 'Lavagem após cada saída'],
    },
  ],
}

const QUICK_FACTS = {
  en: ['Yamaha & Mercury certified technicians', 'Based at Marina de Lagos', 'Genuine parts & documented work'],
  pt: ['Técnicos certificados Yamaha e Mercury', 'Baseados na Marina de Lagos', 'Peças originais e trabalho documentado'],
}

export async function generateMetadata() {
  const locale = await getLocale()
  const page = await getPageData('maintenance', locale)
  const t = getTranslations(locale)
  return {
    title: page?.title ? `${page.title} | Algarve Boat Sales` : `${t('maint_title')} | Algarve Boat Sales`,
    description: page?.meta_description || 'Professional boat maintenance, servicing and renovation in the Algarve.',
    alternates: { canonical: 'https://www.algarveboatsales.com/maintenance' },
  }
}

export default async function MaintenancePage() {
  const locale = await getLocale()
  const t = getTranslations(locale)
  const page = await getPageData('maintenance', locale)
  const services = SERVICES[locale]
  const facts = QUICK_FACTS[locale]

  return (
    <>
      <PageHero
        title={t('maint_title')}
        subtitle={t('maint_subtitle')}
        imageSrc="/media/20250703_113750-scaled.jpg"
        imageAlt="A boat hull on stands being prepared for restoration work"
      />

      <div className="container">
        <section className={styles.intro}>
          <div className={styles.introText}>
            <span className={styles.eyebrow}>{t('maint_eyebrow')}</span>
            <h2 className={styles.introTitle}>{t('maint_intro_title')}</h2>
            <p>{t('maint_intro_p1')}</p>
            <p>{t('maint_intro_p2')}</p>
          </div>

          <aside className={styles.introPanel}>
            <span className={styles.panelIcon} aria-hidden="true">★</span>
            <strong>{t('maint_panel_title')}</strong>
            <p>{t('maint_panel_body')}</p>
            <ul className={styles.facts}>
              {facts.map((f) => (
                <li key={f}><span aria-hidden="true">✓</span>{f}</li>
              ))}
            </ul>
          </aside>
        </section>

        <section className={styles.servicesSection}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>{t('maint_what_title')}</h2>
            <p className={styles.sectionSub}>{t('maint_what_sub')}</p>
          </div>
          <div className={styles.servicesGrid}>
            {services.map(({ title, items }, i) => (
              <div key={title} className={styles.serviceCard}>
                <span className={styles.serviceIndex}>{String(i + 1).padStart(2, '0')}</span>
                <h3>{title}</h3>
                <ul>
                  {items.map((item) => (
                    <li key={item}><span aria-hidden="true">✓</span>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.seasonal}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>{t('maint_seasonal_title')}</h2>
            <p className={styles.sectionSub}>{t('maint_seasonal_sub')}</p>
          </div>
          <div className={styles.seasonGrid}>
            <div className={styles.season}>
              <h3>{t('maint_spring_title')}</h3>
              <p>{t('maint_spring_body')}</p>
            </div>
            <div className={styles.season}>
              <h3>{t('maint_inseason_title')}</h3>
              <p>{t('maint_inseason_body')}</p>
            </div>
            <div className={styles.season}>
              <h3>{t('maint_winter_title')}</h3>
              <p>{t('maint_winter_body')}</p>
            </div>
          </div>
        </section>

        <section className={styles.cta}>
          <div>
            <h2>{t('maint_cta_title')}</h2>
            <p>{t('maint_cta_body')}</p>
          </div>
          <div className={styles.ctaBtns}>
            <Link href="/contact" className="btn btn-gold">{t('maint_cta_btn')}</Link>
            <Link href="/boat-storage" className="btn btn-outline-white">{t('maint_cta_storage')}</Link>
          </div>
        </section>
      </div>

      {page?.content && (
        <div className="container" style={{ paddingBottom: '3rem' }}>
          <RichText content={page.content} className="richtext-content" />
        </div>
      )}
    </>
  )
}
