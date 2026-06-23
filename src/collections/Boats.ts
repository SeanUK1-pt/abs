import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const Boats: CollectionConfig = {
  slug: 'boats',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'make', 'status', 'price', 'condition'],
    listSearchableFields: ['title', 'stock_number'],
  },
  fields: [
    // ── Core ──────────────────────────────────────────────────────────────
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
        { label: 'Under Offer', value: 'under_offer' },
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
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Pin to top of listings' },
    },
    {
      name: 'badge_text',
      type: 'text',
      localized: true,
      admin: { position: 'sidebar', description: 'e.g. "Price Reduced"' },
    },
    {
      name: 'badge_color',
      type: 'text',
      admin: { position: 'sidebar', description: 'Hex colour e.g. #dd3333' },
    },

    // ── Specifications ────────────────────────────────────────────────────
    {
      type: 'collapsible',
      label: 'Specifications',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'make', type: 'relationship', relationTo: 'makes', admin: { width: '50%' } },
            { name: 'model', type: 'relationship', relationTo: 'models', admin: { width: '50%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'year', type: 'number', admin: { width: '25%' } },
            { name: 'length_m', type: 'number', admin: { width: '25%', step: 0.1, description: 'metres' } },
            { name: 'beam_m', type: 'number', admin: { width: '25%', step: 0.01, description: 'metres' } },
            { name: 'engine_hours', type: 'number', admin: { width: '25%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'stock_number', type: 'text', admin: { width: '50%' } },
            {
              name: 'ce_category',
              type: 'select',
              options: [
                { label: 'A — Ocean', value: 'A' },
                { label: 'B — Offshore', value: 'B' },
                { label: 'C — Inshore', value: 'C' },
                { label: 'D — Sheltered', value: 'D' },
              ],
              admin: { width: '50%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'boat_type',
              type: 'select',
              options: [
                { label: 'RIB', value: 'rib' },
                { label: 'Bow Rider', value: 'bow_rider' },
                { label: 'Sports Cruiser', value: 'sports_cruiser' },
                { label: 'Power Boat', value: 'power_boat' },
                { label: 'Sailboat', value: 'sailboat' },
                { label: 'Personal Watercraft', value: 'pwc' },
                { label: 'Aluminium Hull', value: 'aluminium_hull' },
              ],
              admin: { width: '50%' },
            },
            {
              name: 'hull_material',
              type: 'select',
              options: [
                { label: 'GRP / Fibreglass', value: 'grp' },
                { label: 'RIB', value: 'rib' },
                { label: 'Aluminium', value: 'aluminium' },
                { label: 'Steel', value: 'steel' },
                { label: 'Wood', value: 'wood' },
                { label: 'Carbon Fibre', value: 'carbon' },
              ],
              admin: { width: '50%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'drive_type',
              type: 'select',
              options: [
                { label: 'Outboard', value: 'outboard' },
                { label: 'Inboard', value: 'inboard' },
                { label: 'Sterndrive', value: 'sterndrive' },
                { label: 'Jet', value: 'jet' },
              ],
              admin: { width: '50%' },
            },
            {
              name: 'fuel_type',
              type: 'select',
              options: [
                { label: 'Petrol', value: 'petrol' },
                { label: 'Diesel', value: 'diesel' },
                { label: 'Electric', value: 'electric' },
                { label: 'Hybrid', value: 'hybrid' },
              ],
              admin: { width: '50%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'engine_make', type: 'text', admin: { width: '25%', description: 'e.g. Yamaha' } },
            { name: 'engine_model', type: 'text', admin: { width: '25%', description: 'e.g. F150' } },
            { name: 'engine_hp', type: 'number', admin: { width: '25%', description: 'horsepower' } },
            { name: 'engine_count', type: 'number', admin: { width: '25%', description: '1 = single, 2 = twin' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'max_capacity', type: 'number', admin: { width: '25%', description: 'Max persons on board' } },
          ],
        },
      ],
    },

    // ── Pricing ───────────────────────────────────────────────────────────
    {
      type: 'collapsible',
      label: 'Pricing',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'price', type: 'number', required: true, admin: { width: '33%' } },
            { name: 'sale_price', type: 'number', admin: { width: '33%', description: 'Optional reduced price' } },
            {
              name: 'currency',
              type: 'select',
              defaultValue: 'EUR',
              options: [
                { label: 'EUR €', value: 'EUR' },
                { label: 'GBP £', value: 'GBP' },
                { label: 'USD $', value: 'USD' },
              ],
              admin: { width: '33%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'iva_included',
              type: 'checkbox',
              defaultValue: true,
              admin: { width: '50%', description: 'IVA/VAT is included in the price' },
            },
            { name: 'woocommerce_product_id', type: 'number', admin: { width: '50%', description: 'Legacy WooCommerce reference' } },
          ],
        },
      ],
    },

    // ── Location ──────────────────────────────────────────────────────────
    {
      type: 'collapsible',
      label: 'Location',
      fields: [
        { name: 'location', type: 'text', admin: { description: 'e.g. Lagos, Portugal' } },
        {
          type: 'row',
          fields: [
            { name: 'latitude', type: 'number', admin: { width: '50%', step: 0.000001 } },
            { name: 'longitude', type: 'number', admin: { width: '50%', step: 0.000001 } },
          ],
        },
      ],
    },

    // ── Description ───────────────────────────────────────────────────────
    {
      type: 'collapsible',
      label: 'Description',
      fields: [
        {
          name: 'description',
          type: 'richText',
          localized: true,
          editor: lexicalEditor({}),
        },
        {
          name: 'additional_notes',
          type: 'richText',
          localized: true,
          editor: lexicalEditor({}),
        },
      ],
    },

    // ── Features ──────────────────────────────────────────────────────────
    {
      type: 'collapsible',
      label: 'Features',
      fields: [
        {
          name: 'features',
          type: 'relationship',
          relationTo: 'features',
          hasMany: true,
        },
        {
          name: 'custom_features',
          type: 'array',
          admin: { description: 'One-off features not in the library' },
          fields: [
            { name: 'feature', type: 'text', required: true },
          ],
        },
      ],
    },

    // ── Media ─────────────────────────────────────────────────────────────
    {
      type: 'collapsible',
      label: 'Media',
      fields: [
        {
          name: 'main_image',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'gallery',
          type: 'array',
          maxRows: 80,
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
          ],
        },
        { name: 'brochure', type: 'upload', relationTo: 'media', admin: { description: 'PDF brochure' } },
        { name: 'video_url', type: 'text', admin: { description: 'YouTube or Vimeo URL' } },
      ],
    },

    // ── New Boat Options ─────────────────────────────────────────────────
    {
      type: 'collapsible',
      label: 'Factory Options (New boats only)',
      admin: {
        condition: (data) => data?.condition === 'new',
      },
      fields: [
        {
          name: 'options',
          type: 'array',
          fields: [
            { name: 'option_name', type: 'text', required: true, localized: true },
            { name: 'option_price', type: 'number' },
            { name: 'option_description', type: 'text', localized: true },
          ],
        },
      ],
    },
  ],
}
