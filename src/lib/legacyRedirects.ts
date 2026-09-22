/**
 * Legacy WordPress/WooCommerce URLs → current site paths.
 *
 * `from` is a bare, unprefixed, trailing-slash-free path. `middleware.ts`
 * matches this after stripping any /pt-pt, /pt, or /en prefix, then
 * redirects straight to the locale-appropriate destination in a single hop
 * — including for /pt-pt/* requests, which would otherwise be redirected
 * twice (once to normalize /pt-pt → /pt, once for the legacy path itself).
 *
 * `to` is the EN-canonical destination path (localePath() adds /pt for PT
 * requests). It may include a #hash (redirects don't carry the hash to the
 * browser on a 301 — it's resolved client-side after landing on the page).
 */
export interface LegacyRedirect {
  from: string
  to: string
}

export const LEGACY_REDIRECTS: LegacyRedirect[] = [
  // ─── Renamed / restructured pages ───────────────────────────────────────
  { from: '/boats-for-sale', to: '/boats' },
  { from: '/terms-conditions', to: '/terms-and-conditions' },
  { from: '/docks_trailers', to: '/trailers' },

  // ─── Old listing index pages ─────────────────────────────────────────────
  { from: '/listings', to: '/boats' },
  { from: '/trailer-listings', to: '/trailers' },
  { from: '/vanclaes-trailer-configurator', to: '/trailers/configurator' },

  // ─── Old WooCommerce shop & category pages ───────────────────────────────
  { from: '/shop', to: '/boats' },
  { from: '/product-category/power-boats-power-boats', to: '/boats' },

  // ─── Brand pages ────────────────────────────────────────────────────────
  { from: '/yamarin-boats', to: '/brands#yamarin' },
  { from: '/spx-rib', to: '/brands#spx-rib' },

  // ─── Old VersaDock product page — no live equivalent, confirmed no longer
  //      sold/offered. Sent home rather than to a section that implies we
  //      still carry it.
  { from: '/versadock-drive-on-docks', to: '/' },

  // ─── Confirmed active listings (/listings/ → /boats/slug) ───────────────
  { from: '/listings/williams-turbojet-325', to: '/boats/williams-turbojet-325' },
  { from: '/listings/brig-eagle-6-7', to: '/boats/brig-eagle-6-7-2021' },
  { from: '/listings/grand-drive-line-600-lux', to: '/boats/grand-drive-line-600-lux-2026' },
  { from: '/listings/grand-golden-line-680', to: '/boats/grand-golden-line-680-2026-2' },
  { from: '/listings/brig-eagle-10', to: '/boats/brig-eagle-10-2020' },
  { from: '/listings/jeanneau-cap-camarat-12-5-wa', to: '/boats/jeanneau-cap-camarat-12-5-wa-2022' },
  { from: '/listings/nordkapp-avant-705', to: '/boats/nordkapp-avant-705-2022' },
  { from: '/listings/regal-1900', to: '/boats/regal-1900-2008' },
  { from: '/listings/bayliner-vr6', to: '/boats/bayliner-vr6-2018' },
  { from: '/listings/spx-rib-24-dinette-2', to: '/boats/spx-rib-24-dinette-2023' },

  // ─── Confirmed active listings (/product/ → /boats/slug) ────────────────
  { from: '/product/spx-rib-24-dinette', to: '/boats/spx-rib-24-dinette-2023' },

  // ─── Yamarin 63 BR (resolved: all old listings → 2022 unit; a separate,
  //      newer 2026 unit also exists at /boats/yamarin-63-br-2026 but has no
  //      legacy WP URL of its own) ──────────────────────────────────────────
  { from: '/listings/yamarin-63-br', to: '/boats/yamarin-63-br-2022' },
  { from: '/listings/yamarin-63-br-2', to: '/boats/yamarin-63-br-2022' },
  { from: '/product/yamarin-63br', to: '/boats/yamarin-63-br-2022' },

  // ─── Models that were sold/removed when originally audited but are now
  //      back in stock under a different slug — re-pointed to the live
  //      listing instead of the generic /boats index. ─────────────────────
  { from: '/listings/bwa-34', to: '/boats/bwa-34-2018' },
  { from: '/listings/chaparral-275-ssi', to: '/boats/chaparral-275-ssi-2007' },
  { from: '/listings/grand-golden-line-750', to: '/boats/grand-golden-line-750-2026' },
  { from: '/product/grand-golden-line-750-inflatable', to: '/boats/grand-golden-line-750-2026' },
  { from: '/product/brig-eagle-8', to: '/boats/brigeagle8' },
  { from: '/product/brig-eagle-8-inflatables', to: '/boats/brigeagle8' },

  // ─── Sold / removed boats with no live equivalent → inventory index ─────
  { from: '/listings/untitled', to: '/boats' },
  { from: '/listings/bryant-potenza', to: '/boats' },
  { from: '/listings/grand-golden-line-650', to: '/boats' }, // grand-golden-line-650-2024 is sold, no replacement in stock
  { from: '/product/grand-golden-line-650-inflatable', to: '/boats' },
  { from: '/product/grand-golden-line-850-inflatable', to: '/boats' },
  { from: '/product/rio-yachts-daytona-34', to: '/boats' },
  { from: '/product/grand-silverline-300', to: '/boats' },
  // No longer sold under this listing — confirmed no current use.
  { from: '/product/brig-eagle-6-inflatable', to: '/' },
  { from: '/product/yamarin-80dc', to: '/boats' },
  { from: '/product/yamarin-67-dc-premium', to: '/boats' },
  { from: '/product/yamarin-88-dc-premium', to: '/boats' },
]
