import type { GlobalConfig } from 'payload'
import { revalidatePath } from 'next/cache'

const needsText = (label: string, flag: 'enabled' | 'show_bar' | 'show_panel') =>
  (value: unknown, { data }: { data?: Record<string, any> }) =>
    !data?.[flag] || (typeof value === 'string' && value.trim())
      ? true
      : label

export const PromoBanner: GlobalConfig = {
  slug: 'promo-banner',
  label: 'Promotion (banner & homepage panel)',
  admin: {
    group: 'Settings',
    description:
      'Run a promotion such as Black Friday: a slim bar above the header and/or a larger panel on the homepage featuring specific boats. Build it with "Show promotion" OFF, use Preview to check it, then switch it on when you are ready.',
    // Opens the homepage in preview mode (admin login required). Shows the SAVED
    // content even while "Show promotion" is off, so nothing is public yet.
    preview: (_doc, { locale }) =>
      `/api/promo-preview?locale=${typeof locale === 'string' ? locale : (locale as any)?.code === 'pt' ? 'pt' : 'en'}`,
  },
  hooks: {
    afterChange: [
      () => {
        // Refresh any cached pages straight away. Throws outside a web request
        // (e.g. seed scripts) — nothing to refresh there.
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
      type: 'tabs',
      tabs: [
        {
          label: 'Go live',
          description: 'The master switch and optional schedule for everything on the other tabs.',
          fields: [
            {
              name: 'enabled',
              label: 'Show promotion',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description:
                  'The master switch. Untick = nothing is shown to the public, whatever else is set. Use the Preview button (top right) to see it first.',
              },
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
                    description: 'Leave empty to show as soon as "Show promotion" is ticked.',
                  },
                },
                {
                  name: 'show_until',
                  label: 'Hide after (optional)',
                  type: 'date',
                  admin: {
                    width: '50%',
                    date: { pickerAppearance: 'dayAndTime' },
                    description: 'Leave empty to keep showing until you untick "Show promotion". Dates only apply while it is ticked.',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Top bar',
          description: 'A slim bar above the header on every page.',
          fields: [
            {
              name: 'show_bar',
              label: 'Include the top bar',
              type: 'checkbox',
              defaultValue: true,
            },
            {
              name: 'message',
              type: 'text',
              localized: true,
              admin: { description: 'The bar text. Fill in English and Portuguese (Portuguese falls back to English if empty).' },
              validate: needsText('Enter the top bar text, or untick "Include the top bar"', 'show_bar') as any,
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'link_label',
                  label: 'Link text (optional)',
                  type: 'text',
                  localized: true,
                  admin: { width: '50%', description: 'e.g. "See the deals". Leave empty for no link.' },
                },
                {
                  name: 'link_url',
                  label: 'Link address (optional)',
                  type: 'text',
                  admin: { width: '50%', description: 'A page on this site such as /boats, or a full https:// address.' },
                },
              ],
            },
          ],
        },
        {
          label: 'Homepage panel',
          description: 'A larger panel on the homepage that can feature specific boats.',
          fields: [
            {
              name: 'show_panel',
              label: 'Include the homepage panel',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'panel_placement',
              label: 'Where it goes',
              type: 'select',
              defaultValue: 'below_hero',
              options: [
                { label: 'Show below the hero (the normal hero stays)', value: 'below_hero' },
                { label: 'Replace the hero while the promotion runs', value: 'replace_hero' },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'panel_badge',
                  label: 'Small label',
                  type: 'text',
                  localized: true,
                  admin: { width: '40%', description: 'e.g. "Black Friday". Optional.' },
                },
                {
                  name: 'panel_headline',
                  label: 'Headline',
                  type: 'text',
                  localized: true,
                  admin: { width: '60%' },
                  validate: needsText('Enter a headline, or untick "Include the homepage panel"', 'show_panel') as any,
                },
              ],
            },
            {
              name: 'panel_text',
              label: 'Supporting text',
              type: 'textarea',
              localized: true,
              admin: { description: 'One or two sentences under the headline. Optional.' },
            },
            {
              name: 'panel_image',
              label: 'Background picture (optional)',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'A wide picture works best (it is darkened behind the text). Leave empty for the plain navy background.' },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'panel_cta_label',
                  label: 'Button text (optional)',
                  type: 'text',
                  localized: true,
                  admin: { width: '50%', description: 'e.g. "View all boats".' },
                },
                {
                  name: 'panel_cta_url',
                  label: 'Button address (optional)',
                  type: 'text',
                  admin: { width: '50%', description: 'A page on this site such as /boats, or a full https:// address.' },
                },
              ],
            },
            {
              name: 'panel_boats',
              label: 'Boats to feature',
              type: 'array',
              maxRows: 6,
              labels: { singular: 'Boat', plural: 'Boats' },
              admin: {
                description:
                  'Set the deal price on the boat itself (its "Sale price" field, plus a badge such as "Black Friday") — the panel shows exactly what the boat shows, so the two can never disagree. Boats that have sold are skipped automatically.',
              },
              fields: [
                {
                  name: 'boat',
                  type: 'relationship',
                  relationTo: 'boats',
                  required: true,
                  filterOptions: () => ({ status: { not_equals: 'sold' } }),
                },
                {
                  name: 'deal_note',
                  label: 'Note under the boat (optional)',
                  type: 'text',
                  localized: true,
                  admin: { description: 'A short line such as "Trailer included". Optional.' },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
