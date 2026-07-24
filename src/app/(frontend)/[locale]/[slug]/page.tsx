import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import styles from './page.module.css'

export const revalidate = 300

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  const page = docs[0]
  if (!page) return {}
  const canonical = locale === 'pt'
    ? `https://www.algarveboatsales.com/pt/${slug}`
    : `https://www.algarveboatsales.com/${slug}`
  return {
    title: page.title ? `${page.title} | Algarve Boat Sales` : 'Algarve Boat Sales',
    alternates: { canonical },
  }
}

export default async function DynamicPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  const page = docs[0]
  if (!page) notFound()

  return (
    <div className={`container ${styles.page}`}>
      <h1 className={styles.title}>{page.title}</h1>
      <div className={styles.content}>
        {/* Rich text would be rendered by Lexical renderer */}
      </div>
    </div>
  )
}
