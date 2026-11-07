import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import fs from 'fs'
import path from 'path'

// Where Next writes and reads the build. On the server, deploys alternate between
// two folders (.next-a / .next-b) so a new build never touches the one that is
// serving visitors. ".next-current" is a link to the folder in use; it is read once
// when a server process starts, so that process stays on its own build while a new
// one is being made. NEXT_DIST_DIR overrides it (used to build into the spare
// folder). With neither (local development) Next's normal .next folder is used.
function buildDir(): string | undefined {
  if (process.env.NEXT_DIST_DIR) return process.env.NEXT_DIST_DIR
  try {
    return path.relative(process.cwd(), fs.realpathSync('.next-current'))
  } catch {
    return undefined
  }
}
const dist = buildDir()

const nextConfig: NextConfig = {
  ...(dist ? { distDir: dist } : {}),
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
