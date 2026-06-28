import type { CollectionConfig } from 'payload'

export const Updates: CollectionConfig = {
  slug: 'updates',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'publish_date', 'published'],
    description: 'News, arrivals, and announcements shown on the homepage.',
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
            value || data?.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        ],
      },
    },
    {
      name: 'summary',
      type: 'textarea',
      localized: true,
      admin: { description: 'Short blurb shown on the homepage card.' },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'link',
      type: 'text',
      admin: {
        description: 'Optional link (e.g. /boats/some-boat or an external URL). Leave blank for no link.',
      },
    },
    {
      name: 'publish_date',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayOnly', displayFormat: 'dd MMM yyyy' },
      },
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Uncheck to hide this item from the site.',
      },
    },
  ],
}
