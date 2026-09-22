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

  // Legacy WordPress/WooCommerce URL redirects live in src/middleware.ts
  // (src/lib/legacyRedirects.ts has the from -> to table). Handling them in
  // middleware, rather than here, lets one rule serve the bare, /pt-pt, /pt,
  // and /en forms of an old URL in a single hop instead of chaining through
  // the /pt-pt -> /pt locale-normalization redirect first.
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
