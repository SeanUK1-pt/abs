/**
 * Tests for forwarding enquiries to the ABG lead tracker (no real network).
 * Run: npx tsx scripts/test-abg-leads.ts
 */
import { buildAbgPayload, forwardEnquiryToAbg } from '../src/lib/abgLeads'

const KEY = 'dummy-test-key-not-real-123'
let failed = 0
function check(name: string, got: unknown, want: unknown) {
  const ok = JSON.stringify(got) === JSON.stringify(want)
  if (!ok) failed++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${ok ? '' : `\n        got    ${JSON.stringify(got)}\n        wanted ${JSON.stringify(want)}`}`)
}

// ── buildAbgPayload: field mapping ─────────────────────────────────────────
check('boat enquiry maps every field', buildAbgPayload({
  name: ' Ana Silva ', email: 'ana@example.com', phone: '+351 912 345 678', message: 'Is it still available?',
  listingTitle: 'Yamarin 63 BR', listingType: 'boat', listingId: '65f0c', contactMethod: 'whatsapp', locale: 'pt',
  sourceUrl: 'https://www.algarveboatsales.com/pt/boats/yamarin-63-br-2022',
}), {
  name: 'Ana Silva', email: 'ana@example.com', phone: '+351 912 345 678', message: 'Is it still available?',
  interest: 'Yamarin 63 BR (boat)', details: 'Listing id: 65f0c', contactMethod: 'whatsapp', locale: 'pt',
  sourceUrl: 'https://www.algarveboatsales.com/pt/boats/yamarin-63-br-2022',
})
check('trailer type appended', buildAbgPayload({ name: 'A', email: 'a@b.co', listingTitle: 'Vanclaes RMW2750', listingType: 'trailer' }).interest, 'Vanclaes RMW2750 (trailer)')
check('general type is not appended', buildAbgPayload({ name: 'A', email: 'a@b.co', listingTitle: 'General Enquiry', listingType: 'general' }).interest, 'General Enquiry')
check('title without a type', buildAbgPayload({ name: 'A', email: 'a@b.co', listingTitle: 'MasterCraft' }).interest, 'MasterCraft')
check('no title -> no interest', 'interest' in buildAbgPayload({ name: 'A', email: 'a@b.co', listingType: 'boat' }), false)
check('empty phone omitted', 'phone' in buildAbgPayload({ name: 'A', email: 'a@b.co', phone: '   ' }), false)
check('empty listing id -> no details', 'details' in buildAbgPayload({ name: 'A', email: 'a@b.co', listingId: '' }), false)
check('locale en kept', buildAbgPayload({ name: 'A', email: 'a@b.co', locale: 'en' }).locale, 'en')
check('unknown locale omitted', 'locale' in buildAbgPayload({ name: 'A', email: 'a@b.co', locale: 'fr' }), false)
check('missing locale omitted', 'locale' in buildAbgPayload({ name: 'A', email: 'a@b.co' }), false)
check('no consent field is ever sent', 'consent' in buildAbgPayload({ name: 'A', email: 'a@b.co' }), false)
check('message capped at 4000', buildAbgPayload({ name: 'A', email: 'a@b.co', message: 'x'.repeat(5000) }).message?.length, 4000)
check('non-string values are ignored, not thrown', buildAbgPayload({ name: 'A', email: 'a@b.co', phone: 12345 as any, message: null as any }), { name: 'A', email: 'a@b.co' })

// ── forwardEnquiryToAbg: behaviour ─────────────────────────────────────────
const enquiry = { name: 'Ana', email: 'ana@example.com', message: 'Hello', listingTitle: 'Boat', listingType: 'boat' }
type Call = { url: string; init: RequestInit }
const respond = (statuses: Array<number | 'throw'>) => {
  const calls: Call[] = []
  const fetchImpl = (async (url: any, init: any) => {
    calls.push({ url: String(url), init })
    const s = statuses[Math.min(calls.length - 1, statuses.length - 1)]
    if (s === 'throw') throw new DOMException('timed out', 'TimeoutError')
    return new Response(s === 422 ? '{"issues":[{"path":["email"]}]}' : '{}', { status: s })
  }) as typeof fetch
  return { calls, fetchImpl }
}

// Capture console output so we can prove the key never leaks into logs.
const logs: string[] = []
const origWarn = console.warn, origErr = console.error
console.warn = (...a: unknown[]) => { logs.push(a.join(' ')) }
console.error = (...a: unknown[]) => { logs.push(a.join(' ')) }

async function run(statuses: Array<number | 'throw'>, env: { key?: string; url?: string } = { key: KEY }) {
  if (env.key === undefined) delete process.env.ABG_PRICING_API_KEY; else process.env.ABG_PRICING_API_KEY = env.key
  if (env.url === undefined) delete process.env.ABG_PRICING_URL; else process.env.ABG_PRICING_URL = env.url
  logs.length = 0
  const r = respond(statuses)
  let threw = false
  try { await forwardEnquiryToAbg(enquiry, { fetchImpl: r.fetchImpl, retryDelayMs: 1 }) } catch { threw = true }
  return { ...r, threw, logs: [...logs] }
}

;(async () => {
  let r = await run([201])
  check('201: one call, no throw', [r.calls.length, r.threw], [1, false])
  check('posts to the tracker URL by default', r.calls[0].url, 'https://pricing.algarveboatgroup.com/api/inbound/enquiry')
  check('sends the key in X-ABG-Api-Key', (r.calls[0].init.headers as any)['X-ABG-Api-Key'] === KEY, true)
  check('sends JSON', (r.calls[0].init.headers as any)['Content-Type'], 'application/json')
  check('uses POST', r.calls[0].init.method, 'POST')
  check('has a timeout signal', r.calls[0].init.signal instanceof AbortSignal, true)
  check('body is the mapped payload', JSON.parse(String(r.calls[0].init.body)), buildAbgPayload(enquiry))

  r = await run([201], { key: KEY, url: 'http://localhost:9999/mock' })
  check('ABG_PRICING_URL overrides the endpoint', r.calls[0].url, 'http://localhost:9999/mock')

  r = await run([200])
  check('200 (duplicate): one call, no error logged', [r.calls.length, r.logs.length], [1, 0])

  r = await run([201], { key: undefined })
  check('no key: nothing is sent', r.calls.length, 0)
  check('no key: a warning is logged', r.logs.some(l => l.includes('ABG_PRICING_API_KEY is not set')), true)
  check('no key: does not throw', r.threw, false)

  r = await run([401])
  check('401: not retried', r.calls.length, 1)
  check('401: error logged with status', r.logs.some(l => l.includes('HTTP 401')), true)
  check('401: does not throw', r.threw, false)

  r = await run([422])
  check('422: not retried', r.calls.length, 1)
  check('422: the tracker\'s reason is logged', r.logs.some(l => l.includes('HTTP 422') && l.includes('issues')), true)

  r = await run([500, 201])
  check('500 then 201: retried once, ends quietly', [r.calls.length, r.logs.length, r.threw], [2, 0, false])

  r = await run([429, 201])
  check('429 then 201: retried once', r.calls.length, 2)

  r = await run([500, 500])
  check('500 twice: exactly two attempts, error logged', [r.calls.length, r.logs.some(l => l.includes('HTTP 500'))], [2, true])
  check('500 twice: does not throw', r.threw, false)

  r = await run(['throw', 201])
  check('timeout then success: retried once', [r.calls.length, r.logs.length], [2, 0])

  r = await run(['throw', 'throw'])
  check('timeout twice: two attempts, error logged, no throw', [r.calls.length, r.logs.some(l => l.includes('network error or timeout')), r.threw], [2, true, false])

  // Across every scenario above: the key must never appear in any log line.
  const all: string[] = []
  for (const s of [[401], [422], [500, 500], ['throw', 'throw']] as const) all.push(...(await run([...s])).logs)
  r = await run([201], { key: undefined }); all.push(...r.logs)
  check('the key never appears in logs', all.some(l => l.includes(KEY)), false)
  check('visitor email never appears in logs', all.some(l => l.includes('ana@example.com')), false)

  console.warn = origWarn; console.error = origErr
  console.log(failed ? `\n${failed} FAILED` : '\nAll passed')
  process.exit(failed ? 1 : 0)
})()
