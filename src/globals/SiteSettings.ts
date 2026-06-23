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
      label: 'Social Media',
      fields: [
        { name: 'facebook_url', type: 'text' },
        { name: 'instagram_url', type: 'text' },
        { name: 'youtube_url', type: 'text' },
      ],
    },
  ],
}
