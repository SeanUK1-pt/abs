import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import styles from './page.module.css'

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
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
