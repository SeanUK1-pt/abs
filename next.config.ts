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
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
