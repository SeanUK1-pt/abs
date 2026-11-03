import type { GlobalConfig } from 'payload'
import { revalidatePath } from 'next/cache'

export const PromoBanner: GlobalConfig = {
  slug: 'promo-banner',
  label: 'Promo Banner',
  admin: {
    group: 'Settings',
    description:
      'A slim banner shown above the header on every page, e.g. "Black Friday Deals — coming soon". Tick "Show banner" to switch it on; untick it to switch it off. Changes appear on the site straight away.',
  },
  hooks: {
    afterChange: [
      () => {
        // The banner lives in the shared layout, which is cached for up to 5
        // minutes. Refresh it now so the switch takes effect immediately.
        // Throws outside a web request (e.g. seed scripts) — nothing to refresh there.
        try {
          revalidatePath('/', 'layout')
        } catch {
          /* not in a request context */
        }
      },
    ],
  },
  fields: [
    {
      name: 'enabled',
      label: 'Show banner',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'The master switch. Off = the banner is hidden, whatever the dates say.' },
    },
    {
      name: 'message',
      type: 'text',
      localized: true,
      admin: { description: 'The banner text. Fill in both English and Portuguese (Portuguese falls back to English if left empty).' },
      validate: (value: unknown, { siblingData }: { siblingData?: Record<string, unknown> }) =>
        !siblingData?.enabled || (typeof value === 'string' && value.trim())
          ? true
          : 'Enter the banner text before switching the banner on',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'link_label',
          label: 'Link text (optional)',
          type: 'text',
          localized: true,
          admin: { width: '50%', description: 'e.g. "See the deals". Leave empty for a banner with no link.' },
        },
        {
          name: 'link_url',
          label: 'Link address (optional)',
          type: 'text',
          admin: { width: '50%', description: 'A page on this site such as /boats, or a full https:// address.' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'show_from',
          label: 'Show from (optional)',
          type: 'date',
          admin: {
            width: '50%',
            date: { pickerAppearance: 'dayAndTime' },
            description: 'Leave empty to show as soon as the banner is switched on.',
          },
        },
        {
          name: 'show_until',
          label: 'Hide after (optional)',
          type: 'date',
          admin: {
            width: '50%',
            date: { pickerAppearance: 'dayAndTime' },
            description: 'Leave empty to keep showing until you switch it off. Dates only take effect while "Show banner" is ticked.',
          },
        },
      ],
    },
  ],
}
