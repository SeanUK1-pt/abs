import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

import { Boats } from './collections/Boats'
import { Trailers } from './collections/Trailers'
import { Features } from './collections/Features'
import { Makes } from './collections/Makes'
import { Models } from './collections/Models'
import { Pages } from './collections/Pages'
import { Media } from './collections/Media'
import { Enquiries } from './collections/Enquiries'
import { Users } from './collections/Users'

import { MainNavigation } from './globals/MainNavigation'
import { FooterNavigation } from './globals/FooterNavigation'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  sharp,
  secret: process.env.PAYLOAD_SECRET || 'abs-payload-secret-change-in-production',
  admin: {
    user: 'users',
    meta: {
      titleSuffix: '— ABS Admin',
    },
  },
  collections: [
    Boats,
    Trailers,
    Features,
    Makes,
    Models,
    Pages,
    Media,
    Enquiries,
    Users,
  ],
  globals: [MainNavigation, FooterNavigation, SiteSettings],
  editor: lexicalEditor(),
  db: mongooseAdapter({
    url: process.env.DATABASE_URI as string,
  }),
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  localization: {
    locales: [
      { label: 'English', code: 'en' },
      { label: 'Português', code: 'pt' },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  upload: {
    limits: {
      fileSize: 10000000, // 10MB
    },
  },
})
