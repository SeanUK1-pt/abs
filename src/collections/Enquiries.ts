import type { CollectionConfig } from 'payload'

export const Enquiries: CollectionConfig = {
  slug: 'enquiries',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'listing_title', 'contact_method', 'createdAt'],
    description: 'Enquiries submitted via listing pages',
  },
  access: {
    create: () => true,
    read: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
    },
    {
      name: 'contact_method',
      type: 'select',
      options: [
        { label: 'Email', value: 'email' },
        { label: 'Phone', value: 'phone' },
        { label: 'WhatsApp', value: 'whatsapp' },
      ],
    },
    {
      name: 'listing_title',
      type: 'text',
      admin: { readOnly: true },
    },
    {
      name: 'listing_type',
      type: 'select',
      options: [
        { label: 'Boat', value: 'boat' },
        { label: 'Trailer', value: 'trailer' },
        { label: 'General', value: 'general' },
      ],
      admin: { readOnly: true },
    },
    {
      name: 'listing_id',
      type: 'text',
      admin: { readOnly: true },
    },
    {
      name: 'read',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, operation }) => {
        if (operation === 'create') {
          // Email notification sent via API route
        }
      },
    ],
  },
}
