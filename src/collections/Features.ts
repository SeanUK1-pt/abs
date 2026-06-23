import type { CollectionConfig } from 'payload'

export const Features: CollectionConfig = {
  slug: 'features',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'filterable'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Electronics', value: 'electronics' },
        { label: 'Safety', value: 'safety' },
        { label: 'Comfort', value: 'comfort' },
        { label: 'Galley', value: 'galley' },
        { label: 'Mechanical', value: 'mechanical' },
        { label: 'Mooring', value: 'mooring' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'icon',
      type: 'text',
      admin: { description: 'Icon name for frontend display' },
    },
    {
      name: 'filterable',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Show as filter option on search page' },
    },
  ],
}
