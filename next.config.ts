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
      { source: '/boats-for-sale', destination: '/boats', statusCode: 301 },
      { source: '/boats-for-sale/', destination: '/boats', statusCode: 301 },
      { source: '/terms-conditions', destination: '/terms-and-conditions', statusCode: 301 },
      { source: '/terms-conditions/', destination: '/terms-and-conditions', statusCode: 301 },
      { source: '/docks_trailers', destination: '/trailers', statusCode: 301 },
      { source: '/docks_trailers/', destination: '/trailers', statusCode: 301 },

      // ─── Old WooCommerce shop & category pages ───────────────────────────────
      { source: '/shop', destination: '/boats', statusCode: 301 },
      { source: '/shop/', destination: '/boats', statusCode: 301 },
      { source: '/product-category/power-boats-power-boats', destination: '/boats', statusCode: 301 },
      { source: '/product-category/power-boats-power-boats/', destination: '/boats', statusCode: 301 },

      // ─── Brand pages ────────────────────────────────────────────────────────
      // NOTE: HTTP 301s don't carry URL fragments — browsers receive the redirect
      // to /brands and then scroll to the anchor client-side. Google will pass
      // link equity to /brands, not to the specific section. If /yamarin-boats
      // or /spx-rib had meaningful PageRank on WordPress, consider creating real
      // /brands/yamarin and /brands/spx-rib pages rather than anchor-only targets.
      { source: '/yamarin-boats', destination: '/brands#yamarin', statusCode: 301 },
      { source: '/yamarin-boats/', destination: '/brands#yamarin', statusCode: 301 },
      { source: '/spx-rib', destination: '/brands#spx-rib', statusCode: 301 },
      { source: '/spx-rib/', destination: '/brands#spx-rib', statusCode: 301 },

      // ─── Confirmed active listings (/listings/ → /boats/slug) ───────────────
      { source: '/listings/williams-turbojet-325', destination: '/boats/williams-turbojet-325', statusCode: 301 },
      { source: '/listings/williams-turbojet-325/', destination: '/boats/williams-turbojet-325', statusCode: 301 },
      { source: '/listings/brig-eagle-6-7', destination: '/boats/brig-eagle-6-7-2021', statusCode: 301 },
      { source: '/listings/brig-eagle-6-7/', destination: '/boats/brig-eagle-6-7-2021', statusCode: 301 },
      { source: '/listings/grand-drive-line-600-lux', destination: '/boats/grand-drive-line-600-lux-2026', statusCode: 301 },
      { source: '/listings/grand-drive-line-600-lux/', destination: '/boats/grand-drive-line-600-lux-2026', statusCode: 301 },
      // ⚠ VERIFY: CSV notes this may not be the same physical boat — check before deploy.
      { source: '/listings/grand-golden-line-680', destination: '/boats/grand-golden-line-680-2026-2', statusCode: 301 },
      { source: '/listings/grand-golden-line-680/', destination: '/boats/grand-golden-line-680-2026-2', statusCode: 301 },
      { source: '/listings/brig-eagle-10', destination: '/boats/brig-eagle-10-2020', statusCode: 301 },
      { source: '/listings/brig-eagle-10/', destination: '/boats/brig-eagle-10-2020', statusCode: 301 },
      { source: '/listings/jeanneau-cap-camarat-12-5-wa', destination: '/boats/jeanneau-cap-camarat-12-5-wa-2022', statusCode: 301 },
      { source: '/listings/jeanneau-cap-camarat-12-5-wa/', destination: '/boats/jeanneau-cap-camarat-12-5-wa-2022', statusCode: 301 },
      { source: '/listings/nordkapp-avant-705', destination: '/boats/nordkapp-avant-705-2022', statusCode: 301 },
      { source: '/listings/nordkapp-avant-705/', destination: '/boats/nordkapp-avant-705-2022', statusCode: 301 },
      { source: '/listings/regal-1900', destination: '/boats/regal-1900-2008', statusCode: 301 },
      { source: '/listings/regal-1900/', destination: '/boats/regal-1900-2008', statusCode: 301 },
      { source: '/listings/bayliner-vr6', destination: '/boats/bayliner-vr6-2018', statusCode: 301 },
      { source: '/listings/bayliner-vr6/', destination: '/boats/bayliner-vr6-2018', statusCode: 301 },
      { source: '/listings/spx-rib-24-dinette-2', destination: '/boats/spx-rib-24-dinette-2023', statusCode: 301 },
      { source: '/listings/spx-rib-24-dinette-2/', destination: '/boats/spx-rib-24-dinette-2023', statusCode: 301 },

      // ─── Confirmed active listings (/product/ → /boats/slug) ────────────────
      { source: '/product/spx-rib-24-dinette', destination: '/boats/spx-rib-24-dinette-2023', statusCode: 301 },
      { source: '/product/spx-rib-24-dinette/', destination: '/boats/spx-rib-24-dinette-2023', statusCode: 301 },

      // ─── Sold / removed boats from /listings/ → inventory page ──────────────
      { source: '/listings/untitled', destination: '/boats', statusCode: 301 },
      { source: '/listings/untitled/', destination: '/boats', statusCode: 301 },
      { source: '/listings/bwa-34', destination: '/boats', statusCode: 301 },
      { source: '/listings/bwa-34/', destination: '/boats', statusCode: 301 },
      { source: '/listings/chaparral-275-ssi', destination: '/boats', statusCode: 301 },
      { source: '/listings/chaparral-275-ssi/', destination: '/boats', statusCode: 301 },
      { source: '/listings/bryant-potenza', destination: '/boats', statusCode: 301 },
      { source: '/listings/bryant-potenza/', destination: '/boats', statusCode: 301 },
      { source: '/listings/grand-golden-line-650', destination: '/boats', statusCode: 301 },
      { source: '/listings/grand-golden-line-650/', destination: '/boats', statusCode: 301 },
      { source: '/listings/grand-golden-line-750', destination: '/boats', statusCode: 301 },
      { source: '/listings/grand-golden-line-750/', destination: '/boats', statusCode: 301 },

      // ─── Sold / removed boats from /product/ → inventory page ───────────────
      { source: '/product/grand-golden-line-650-inflatable', destination: '/boats', statusCode: 301 },
      { source: '/product/grand-golden-line-650-inflatable/', destination: '/boats', statusCode: 301 },
      { source: '/product/grand-golden-line-750-inflatable', destination: '/boats', statusCode: 301 },
      { source: '/product/grand-golden-line-750-inflatable/', destination: '/boats', statusCode: 301 },
      { source: '/product/grand-golden-line-850-inflatable', destination: '/boats', statusCode: 301 },
      { source: '/product/grand-golden-line-850-inflatable/', destination: '/boats', statusCode: 301 },
      { source: '/product/rio-yachts-daytona-34', destination: '/boats', statusCode: 301 },
      { source: '/product/rio-yachts-daytona-34/', destination: '/boats', statusCode: 301 },
      { source: '/product/grand-silverline-300', destination: '/boats', statusCode: 301 },
      { source: '/product/grand-silverline-300/', destination: '/boats', statusCode: 301 },
      { source: '/product/brig-eagle-8', destination: '/boats', statusCode: 301 },
      { source: '/product/brig-eagle-8/', destination: '/boats', statusCode: 301 },
      { source: '/product/brig-eagle-8-inflatables', destination: '/boats', statusCode: 301 },
      { source: '/product/brig-eagle-8-inflatables/', destination: '/boats', statusCode: 301 },
      // ⚠ VERIFY: May be the same boat as /boats/brig-eagle-6-7-2021. If confirmed,
      //   change this destination to /boats/brig-eagle-6-7-2021 rather than /boats.
      { source: '/product/brig-eagle-6-inflatable', destination: '/boats', statusCode: 301 },
      { source: '/product/brig-eagle-6-inflatable/', destination: '/boats', statusCode: 301 },
      { source: '/product/yamarin-80dc', destination: '/boats', statusCode: 301 },
      { source: '/product/yamarin-80dc/', destination: '/boats', statusCode: 301 },
      { source: '/product/yamarin-67-dc-premium', destination: '/boats', statusCode: 301 },
      { source: '/product/yamarin-67-dc-premium/', destination: '/boats', statusCode: 301 },
      { source: '/product/yamarin-88-dc-premium', destination: '/boats', statusCode: 301 },
      { source: '/product/yamarin-88-dc-premium/', destination: '/boats', statusCode: 301 },

      // ─── Yamarin 63 BR (resolved: all old listings → 2022 unit) ────────────
      { source: '/listings/yamarin-63-br', destination: '/boats/yamarin-63-br-2022', statusCode: 301 },
      { source: '/listings/yamarin-63-br/', destination: '/boats/yamarin-63-br-2022', statusCode: 301 },
      { source: '/listings/yamarin-63-br-2', destination: '/boats/yamarin-63-br-2022', statusCode: 301 },
      { source: '/listings/yamarin-63-br-2/', destination: '/boats/yamarin-63-br-2022', statusCode: 301 },
      { source: '/product/yamarin-63br', destination: '/boats/yamarin-63-br-2022', statusCode: 301 },
      { source: '/product/yamarin-63br/', destination: '/boats/yamarin-63-br-2022', statusCode: 301 },
    ]
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
