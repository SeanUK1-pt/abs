import type { GlobalConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  admin: { group: 'Settings' },
  fields: [
    { name: 'site_name', type: 'text', defaultValue: 'Algarve Boat Sales' },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    {
      type: 'collapsible',
      label: 'Contact',
      fields: [
        { name: 'contact_email', type: 'email' },
        { name: 'contact_phone', type: 'text' },
        { name: 'whatsapp_number', type: 'text', admin: { description: 'Include country code e.g. +351912345678' } },
        { name: 'address', type: 'richText', localized: true, editor: lexicalEditor({}) },
        { name: 'google_maps_url', type: 'text' },
      ],
    },
    {
      type: 'collapsible',
      label: 'Brokerage listings',
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'brokerage_short_notice',
          label: 'Short notice',
          type: 'text',
          localized: true,
          admin: {
            description:
              'One line shown on results cards and beside the price of any boat ticked "Brokerage listing". Fill in English and Portuguese. If left blank, the standard wording is used.',
          },
        },
        {
          name: 'brokerage_disclaimer',
          label: 'Full disclaimer',
          type: 'textarea',
          localized: true,
          admin: {
            rows: 8,
            description:
              'Shown in full on the boat page of any boat ticked "Brokerage listing". Fill in English and Portuguese. If left blank, the standard wording is used.',
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Social Media',
      fields: [
        { name: 'facebook_url', type: 'text' },
        { name: 'instagram_url', type: 'text' },
        { name: 'youtube_url', type: 'text' },
      ],
    },
  ],
}
