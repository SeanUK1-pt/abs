import { getPayload } from 'payload'
import config from '../payload.config'

async function run() {
  const payload = await getPayload({ config })

  // Find the about page
  const { docs } = await payload.find({ collection: 'pages', where: { slug: { equals: 'about' } }, limit: 1 })
  const page = docs[0] as any
  if (!page) { console.log('Page not found'); process.exit(1) }

  console.log('Found page:', page.id, page.title)
  console.log('Current content:', JSON.stringify(page.content)?.substring(0, 100))

  // Add a simple Lexical content block
  const testContent = {
    root: {
      children: [
        {
          children: [{ detail: 0, format: 0, mode: 'normal', style: '', text: 'This is a test paragraph added via the API. If you can see this, the rendering pipeline is working correctly.', type: 'text', version: 1 }],
          direction: 'ltr', format: '', indent: 0, type: 'paragraph', version: 1,
        },
      ],
      direction: 'ltr', format: '', indent: 0, type: 'root', version: 1,
    },
  }

  await payload.update({ collection: 'pages', id: page.id, data: { content: testContent }, locale: 'en' as any })
  console.log('✅ Test content written to about page. Check http://localhost:3000/about')
  process.exit(0)
}

run().catch(e => { console.error(e); process.exit(1) })
