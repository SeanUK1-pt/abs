import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const Trailers: CollectionConfig = {
  slug: 'trailers',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'price', 'condition'],
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
      hooks: {
        beforeValidate: [
          ({ value, data }) =>
            value ||
            data?.title?.en
              ?.toLowerCase()
              .replace(/\s+/g, '-')
              .replace(/[^a-z0-9-]/g, ''),
        ],
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'available',
      options: [
        { label: 'Available', value: 'available' },
        { label: 'Sold', value: 'sold' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'condition',
      type: 'select',
      required: true,
      options: [
        { label: 'New', value: 'new' },
        { label: 'Used', value: 'used' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      type: 'row',
      fields: [
        { name: 'make', type: 'text', admin: { width: '50%' } },
        { name: 'model', type: 'text', admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'year', type: 'number', admin: { width: '50%' } },
        { name: 'price', type: 'number', required: true, admin: { width: '50%' } },
      ],
    },
    {
      name: 'iva_included',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      type: 'collapsible',
      label: 'Specifications',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'length_m', type: 'number', admin: { width: '33%', description: 'metres' } },
            { name: 'width_m', type: 'number', admin: { width: '33%', description: 'metres' } },
            { name: 'axles', type: 'number', admin: { width: '33%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'gross_weight_kg', type: 'number', admin: { width: '33%' } },
            { name: 'payload_kg', type: 'number', admin: { width: '33%' } },
            { name: 'tire_size', type: 'text', admin: { width: '33%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'braked', type: 'checkbox', admin: { width: '33%' } },
            { name: 'construction', type: 'text', admin: { width: '66%', description: 'e.g. Stainless Steel' } },
          ],
        },
      ],
    },
    {
      name: 'description',
      type: 'richText',
      localized: true,
      editor: lexicalEditor({}),
    },
    { name: 'location', type: 'text' },
    {
      name: 'main_image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'gallery',
      type: 'array',
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
      ],
    },
  ],
}
