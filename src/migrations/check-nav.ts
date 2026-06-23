import { getPayload } from 'payload'
import config from '../payload.config'

const payload = await getPayload({ config })
const nav = await payload.findGlobal({ slug: 'main-navigation', locale: 'en' as any })
console.log('EN items:', JSON.stringify((nav as any).items, null, 2))
process.exit(0)
