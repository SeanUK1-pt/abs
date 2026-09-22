/**
 * Exercises every legacy-URL redirect (plus a handful of already-fixed
 * control cases) against a running server and checks:
 *  - status is 301 (not 307/308/302)
 *  - the Location header points at the expected destination
 *  - following that Location returns 200 in ONE further hop (no chains)
 *  - query strings are preserved onto the destination
 *
 * Run: npx tsx scripts/test-redirects.ts [baseUrl]
 * Defaults to http://localhost:3000
 */
import { LEGACY_REDIRECTS } from '../src/lib/legacyRedirects'

const BASE = process.argv[2] || process.env.BASE_URL || 'http://localhost:3000'

interface Case {
  path: string
  expectLocation: string
  label: string
}

function localePath(locale: 'en' | 'pt', path: string): string {
  return locale === 'pt' ? `/pt${path}` : path
}

const cases: Case[] = []

for (const { from, to } of LEGACY_REDIRECTS) {
  const variants: Array<{ prefix: string; locale: 'en' | 'pt' }> = [
    { prefix: '', locale: 'en' },
    { prefix: '/en', locale: 'en' },
    { prefix: '/pt', locale: 'pt' },
    { prefix: '/pt-pt', locale: 'pt' },
  ]
  for (const { prefix, locale } of variants) {
    const expectLocation = localePath(locale, to)
    cases.push({
      path: `${prefix}${from}`,
      expectLocation,
      label: `${prefix}${from} -> ${expectLocation}`,
    })
    // Trailing-slash form too — old WordPress links (including the reported
    // /pt-pt/... 404s) commonly carry a trailing slash.
    cases.push({
      path: `${prefix}${from}/`,
      expectLocation,
      label: `${prefix}${from}/ -> ${expectLocation}`,
    })
  }
}

// Explicitly-reported 404s — must be present in the generated matrix above.
const required = [
  '/pt-pt/listings/yamarin-63-br/',
  '/pt-pt/listings/grand-golden-line-650/',
  '/versadock-drive-on-docks/',
]

// Previously-fixed redirects that must keep working exactly as-is.
const controlCases: Case[] = [
  { path: '/listings', expectLocation: '/boats', label: 'control: /listings' },
  { path: '/listings/', expectLocation: '/boats', label: 'control: /listings/' },
  { path: '/trailer-listings', expectLocation: '/trailers', label: 'control: /trailer-listings' },
  { path: '/trailer-listings/', expectLocation: '/trailers', label: 'control: /trailer-listings/' },
  { path: '/vanclaes-trailer-configurator', expectLocation: '/trailers/configurator', label: 'control: /vanclaes-trailer-configurator' },
  { path: '/vanclaes-trailer-configurator/', expectLocation: '/trailers/configurator', label: 'control: /vanclaes-trailer-configurator/' },
]

// Next.js normalizes any trailing slash (308) before any app routing runs at
// all — confirmed identically on production today, even for a real page like
// /boats/ that has no redirect rule of its own. That first hop is a platform
// characteristic, not something a redirect rule can skip, so a trailing-slash
// legacy URL is expected to take that 308 before our 301 — 2 hops total, same
// depth as the already-"fixed" /listings/ etc. have in production right now.
async function checkOne(c: Case): Promise<string | null> {
  let res = await fetch(`${BASE}${c.path}`, { redirect: 'manual' })
  let hops = 0
  const trail: string[] = [c.path]

  if (c.path.endsWith('/') && c.path !== '/') {
    if (res.status !== 308) {
      return `${c.label}: expected the platform trailing-slash 308 first, got ${res.status}`
    }
    const deslashed = res.headers.get('location') || ''
    trail.push(deslashed)
    res = await fetch(`${BASE}${deslashed}`, { redirect: 'manual' })
    hops++
  }

  if (res.status !== 301) {
    return `${c.label}: expected 301 (after ${hops} platform hop(s): ${trail.join(' -> ')}), got ${res.status}`
  }
  const location = res.headers.get('location') || ''
  const locationPath = location.replace(/^https?:\/\/[^/]+/, '').split('#')[0]
  const expected = c.expectLocation.split('#')[0]
  if (locationPath !== expected) {
    return `${c.label}: expected Location "${expected}", got "${locationPath}"`
  }
  trail.push(location)

  // Follow it: must land on 200 with no further redirects of any kind.
  const next = await fetch(`${BASE}${location}`, { redirect: 'manual' })
  if (next.status === 301 || next.status === 302 || next.status === 307 || next.status === 308) {
    return `${c.label}: redirect chain (${trail.join(' -> ')}) — ${location} itself redirects (${next.status} -> ${next.headers.get('location')})`
  }
  if (next.status !== 200) {
    return `${c.label}: destination ${location} returned ${next.status}, expected 200 (chain: ${trail.join(' -> ')})`
  }
  return null
}

async function checkQueryStringPreserved(): Promise<string | null> {
  const path = '/listings/yamarin-63-br?utm_source=test&utm_campaign=abc'
  const res = await fetch(`${BASE}${path}`, { redirect: 'manual' })
  const location = res.headers.get('location') || ''
  if (!location.includes('utm_source=test') || !location.includes('utm_campaign=abc')) {
    return `query-string preservation: expected utm params on Location, got "${location}"`
  }
  return null
}

async function main() {
  const failures: string[] = []
  let passed = 0

  for (const path of required) {
    if (!cases.some(c => c.path === path)) {
      failures.push(`required case missing from matrix: ${path}`)
    }
  }

  for (const c of [...cases, ...controlCases]) {
    const err = await checkOne(c)
    if (err) failures.push(err)
    else passed++
  }

  const qsErr = await checkQueryStringPreserved()
  if (qsErr) failures.push(qsErr)
  else passed++

  console.log(`\n${passed} passed, ${failures.length} failed (base: ${BASE})\n`)
  if (failures.length) {
    console.log('Failures:')
    for (const f of failures) console.log(`  - ${f}`)
    process.exit(1)
  }
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
