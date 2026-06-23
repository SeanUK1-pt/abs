import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'content',
      type: 'richText',
      localized: true,
      editor: lexicalEditor({}),
      admin: {
        description: 'Additional content displayed below the page layout. Use this to add news, updates, or extra information.',
      },
    },
    {
      name: 'meta_description',
      type: 'text',
      localized: true,
      admin: {
        position: 'sidebar',
        description: 'Used by search engines. Keep under 160 characters.',
      },
    },
  ],
}
