import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: 'algarveboatsales.com' },
      { protocol: 'https', hostname: 'sandbox.algarveboatsales.com' },
    ],
  },

  async redirects() {
    return [
      // ─── Renamed / restructured pages ───────────────────────────────────────
      { source: '/boats-for-sale', destination: '/boats', permanent: true },
      { source: '/boats-for-sale/', destination: '/boats', permanent: true },
      { source: '/terms-conditions', destination: '/terms-and-conditions', permanent: true },
      { source: '/terms-conditions/', destination: '/terms-and-conditions', permanent: true },
      { source: '/docks_trailers', destination: '/trailers', permanent: true },
      { source: '/docks_trailers/', destination: '/trailers', permanent: true },

      // ─── Old WooCommerce shop & category pages ───────────────────────────────
      { source: '/shop', destination: '/boats', permanent: true },
      { source: '/shop/', destination: '/boats', permanent: true },
      { source: '/product-category/power-boats-power-boats', destination: '/boats', permanent: true },
      { source: '/product-category/power-boats-power-boats/', destination: '/boats', permanent: true },

      // ─── Brand pages ────────────────────────────────────────────────────────
      // NOTE: HTTP 301s don't carry URL fragments — browsers receive the redirect
      // to /brands and then scroll to the anchor client-side. Google will pass
      // link equity to /brands, not to the specific section. If /yamarin-boats
      // or /spx-rib had meaningful PageRank on WordPress, consider creating real
      // /brands/yamarin and /brands/spx-rib pages rather than anchor-only targets.
      { source: '/yamarin-boats', destination: '/brands#yamarin', permanent: true },
      { source: '/yamarin-boats/', destination: '/brands#yamarin', permanent: true },
      { source: '/spx-rib', destination: '/brands#spx-rib', permanent: true },
      { source: '/spx-rib/', destination: '/brands#spx-rib', permanent: true },

      // ─── Confirmed active listings (/listings/ → /boats/slug) ───────────────
      { source: '/listings/williams-turbojet-325', destination: '/boats/williams-turbojet-325', permanent: true },
      { source: '/listings/williams-turbojet-325/', destination: '/boats/williams-turbojet-325', permanent: true },
      { source: '/listings/brig-eagle-6-7', destination: '/boats/brig-eagle-6-7-2021', permanent: true },
      { source: '/listings/brig-eagle-6-7/', destination: '/boats/brig-eagle-6-7-2021', permanent: true },
      { source: '/listings/grand-drive-line-600-lux', destination: '/boats/grand-drive-line-600-lux-2026', permanent: true },
      { source: '/listings/grand-drive-line-600-lux/', destination: '/boats/grand-drive-line-600-lux-2026', permanent: true },
      // ⚠ VERIFY: CSV notes this may not be the same physical boat — check before deploy.
      { source: '/listings/grand-golden-line-680', destination: '/boats/grand-golden-line-680-2026-2', permanent: true },
      { source: '/listings/grand-golden-line-680/', destination: '/boats/grand-golden-line-680-2026-2', permanent: true },
      { source: '/listings/brig-eagle-10', destination: '/boats/brig-eagle-10-2020', permanent: true },
      { source: '/listings/brig-eagle-10/', destination: '/boats/brig-eagle-10-2020', permanent: true },
      { source: '/listings/jeanneau-cap-camarat-12-5-wa', destination: '/boats/jeanneau-cap-camarat-12-5-wa-2022', permanent: true },
      { source: '/listings/jeanneau-cap-camarat-12-5-wa/', destination: '/boats/jeanneau-cap-camarat-12-5-wa-2022', permanent: true },
      { source: '/listings/nordkapp-avant-705', destination: '/boats/nordkapp-avant-705-2022', permanent: true },
      { source: '/listings/nordkapp-avant-705/', destination: '/boats/nordkapp-avant-705-2022', permanent: true },
      { source: '/listings/regal-1900', destination: '/boats/regal-1900-2008', permanent: true },
      { source: '/listings/regal-1900/', destination: '/boats/regal-1900-2008', permanent: true },
      { source: '/listings/bayliner-vr6', destination: '/boats/bayliner-vr6-2018', permanent: true },
      { source: '/listings/bayliner-vr6/', destination: '/boats/bayliner-vr6-2018', permanent: true },
      { source: '/listings/spx-rib-24-dinette-2', destination: '/boats/spx-rib-24-dinette-2023', permanent: true },
      { source: '/listings/spx-rib-24-dinette-2/', destination: '/boats/spx-rib-24-dinette-2023', permanent: true },

      // ─── Confirmed active listings (/product/ → /boats/slug) ────────────────
      { source: '/product/spx-rib-24-dinette', destination: '/boats/spx-rib-24-dinette-2023', permanent: true },
      { source: '/product/spx-rib-24-dinette/', destination: '/boats/spx-rib-24-dinette-2023', permanent: true },

      // ─── Sold / removed boats from /listings/ → inventory page ──────────────
      { source: '/listings/untitled', destination: '/boats', permanent: true },
      { source: '/listings/untitled/', destination: '/boats', permanent: true },
      { source: '/listings/bwa-34', destination: '/boats', permanent: true },
      { source: '/listings/bwa-34/', destination: '/boats', permanent: true },
      { source: '/listings/chaparral-275-ssi', destination: '/boats', permanent: true },
      { source: '/listings/chaparral-275-ssi/', destination: '/boats', permanent: true },
      { source: '/listings/bryant-potenza', destination: '/boats', permanent: true },
      { source: '/listings/bryant-potenza/', destination: '/boats', permanent: true },
      { source: '/listings/grand-golden-line-650', destination: '/boats', permanent: true },
      { source: '/listings/grand-golden-line-650/', destination: '/boats', permanent: true },
      { source: '/listings/grand-golden-line-750', destination: '/boats', permanent: true },
      { source: '/listings/grand-golden-line-750/', destination: '/boats', permanent: true },

      // ─── Sold / removed boats from /product/ → inventory page ───────────────
      { source: '/product/grand-golden-line-650-inflatable', destination: '/boats', permanent: true },
      { source: '/product/grand-golden-line-650-inflatable/', destination: '/boats', permanent: true },
      { source: '/product/grand-golden-line-750-inflatable', destination: '/boats', permanent: true },
      { source: '/product/grand-golden-line-750-inflatable/', destination: '/boats', permanent: true },
      { source: '/product/grand-golden-line-850-inflatable', destination: '/boats', permanent: true },
      { source: '/product/grand-golden-line-850-inflatable/', destination: '/boats', permanent: true },
      { source: '/product/rio-yachts-daytona-34', destination: '/boats', permanent: true },
      { source: '/product/rio-yachts-daytona-34/', destination: '/boats', permanent: true },
      { source: '/product/grand-silverline-300', destination: '/boats', permanent: true },
      { source: '/product/grand-silverline-300/', destination: '/boats', permanent: true },
      { source: '/product/brig-eagle-8', destination: '/boats', permanent: true },
      { source: '/product/brig-eagle-8/', destination: '/boats', permanent: true },
      { source: '/product/brig-eagle-8-inflatables', destination: '/boats', permanent: true },
      { source: '/product/brig-eagle-8-inflatables/', destination: '/boats', permanent: true },
      // ⚠ VERIFY: May be the same boat as /boats/brig-eagle-6-7-2021. If confirmed,
      //   change this destination to /boats/brig-eagle-6-7-2021 rather than /boats.
      { source: '/product/brig-eagle-6-inflatable', destination: '/boats', permanent: true },
      { source: '/product/brig-eagle-6-inflatable/', destination: '/boats', permanent: true },
      { source: '/product/yamarin-80dc', destination: '/boats', permanent: true },
      { source: '/product/yamarin-80dc/', destination: '/boats', permanent: true },
      { source: '/product/yamarin-67-dc-premium', destination: '/boats', permanent: true },
      { source: '/product/yamarin-67-dc-premium/', destination: '/boats', permanent: true },
      { source: '/product/yamarin-88-dc-premium', destination: '/boats', permanent: true },
      { source: '/product/yamarin-88-dc-premium/', destination: '/boats', permanent: true },

      // ─── TODO: NEEDS SEAN ────────────────────────────────────────────────────
      // Two Yamarin 63 BR units exist in inventory (2026 and 2022). Resolve which
      // old WordPress listing maps to which slug, then add:
      //
      // { source: '/listings/yamarin-63-br', destination: '/boats/yamarin-63-br-????', permanent: true },
      // { source: '/listings/yamarin-63-br/', destination: '/boats/yamarin-63-br-????', permanent: true },
      // { source: '/listings/yamarin-63-br-2', destination: '/boats/yamarin-63-br-????', permanent: true },
      // { source: '/listings/yamarin-63-br-2/', destination: '/boats/yamarin-63-br-????', permanent: true },
      // { source: '/product/yamarin-63br', destination: '/boats/yamarin-63-br-????', permanent: true },
      // { source: '/product/yamarin-63br/', destination: '/boats/yamarin-63-br-????', permanent: true },
    ]
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
