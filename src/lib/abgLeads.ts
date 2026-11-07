/**
 * Forward accepted website enquiries to the ABG Pricing Tool lead tracker.
 *
 * Additive and best-effort: it must never change the visitor's response or the
 * saved enquiry. Server-side only.
 *
 * Env (server only, never in git or the browser):
 *   ABG_PRICING_API_KEY  this site's key; if unset, forwarding is skipped
 *   ABG_PRICING_URL      optional override of the endpoint below
 */

const DEFAULT_URL = 'https://pricing.algarveboatgroup.com/api/inbound/enquiry'
const TIMEOUT_MS = 4000
const RETRY_DELAY_MS = 1500

export interface AbgEnquiry {
  name: string
  email: string
  phone?: string
  message?: string
  listingTitle?: string
  listingType?: string
  listingId?: string
  contactMethod?: string
  locale?: string
  sourceUrl?: string
}

const clean = (v: unknown, max: number): string | undefined => {
  const s = typeof v === 'string' ? v.trim() : ''
  return s ? s.slice(0, max) : undefined
}

// Maps a saved enquiry onto the tracker's fields. Empty values are omitted.
export function buildAbgPayload(e: AbgEnquiry): Record<string, string> {
  const title = clean(e.listingTitle, 300)
  const type = clean(e.listingType, 40)
  // 'general' is the placeholder for "no specific listing" — not worth appending.
  const interest = title ? (type && type !== 'general' ? `${title} (${type})` : title) : undefined
  const listingId = clean(e.listingId, 100)
  const locale = e.locale === 'en' || e.locale === 'pt' ? e.locale : undefined

  const payload: Record<string, string | undefined> = {
    name: clean(e.name, 200),
    email: clean(e.email, 320),
    phone: clean(e.phone, 60),
    message: clean(e.message, 4000),
    interest,
    details: listingId ? `Listing id: ${listingId}` : undefined,
    contactMethod: clean(e.contactMethod, 40),
    locale,
    sourceUrl: clean(e.sourceUrl, 1000),
  }
  return Object.fromEntries(Object.entries(payload).filter(([, v]) => v !== undefined)) as Record<string, string>
}

type FetchLike = typeof fetch

// Retry once only for failures that might clear up: network error, timeout,
// 429 or 5xx. The endpoint de-duplicates identical enquiries, so a retry is safe.
const retryable = (status: number) => status === 429 || status >= 500

async function post(fetchImpl: FetchLike, url: string, key: string, body: string): Promise<Response> {
  return fetchImpl(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-ABG-Api-Key': key },
    body,
    signal: AbortSignal.timeout(TIMEOUT_MS),
  })
}

// Resolves quietly in every case; logs (never the key, never visitor data).
export async function forwardEnquiryToAbg(
  enquiry: AbgEnquiry,
  opts: { fetchImpl?: FetchLike; retryDelayMs?: number } = {},
): Promise<void> {
  const key = process.env.ABG_PRICING_API_KEY
  if (!key) {
    console.warn('ABG lead tracker: ABG_PRICING_API_KEY is not set — enquiry not forwarded')
    return
  }

  const url = process.env.ABG_PRICING_URL || DEFAULT_URL
  const fetchImpl = opts.fetchImpl ?? fetch
  const body = JSON.stringify(buildAbgPayload(enquiry))

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await post(fetchImpl, url, key, body)
      if (res.ok) return // 201 created / matched, or 200 duplicate

      if (attempt === 1 && retryable(res.status)) {
        await new Promise(r => setTimeout(r, opts.retryDelayMs ?? RETRY_DELAY_MS))
        continue
      }
      // 401 = bad key, 422 = validation (the response lists which fields).
      const detail = (await res.text().catch(() => '')).slice(0, 300)
      console.error(`ABG lead tracker: enquiry not forwarded (HTTP ${res.status}) ${detail}`)
      return
    } catch (err) {
      if (attempt === 1) {
        await new Promise(r => setTimeout(r, opts.retryDelayMs ?? RETRY_DELAY_MS))
        continue
      }
      console.error('ABG lead tracker: enquiry not forwarded (network error or timeout):', (err as Error)?.name || 'error')
      return
    }
  }
}
