import type { GlobalConfig } from 'payload'

export const MainNavigation: GlobalConfig = {
  slug: 'main-navigation',
  admin: { group: 'Navigation' },
  fields: [
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'link', type: 'text', required: true },
        { name: 'open_in_new_tab', type: 'checkbox', defaultValue: false },
      ],
    },
  ],
}
