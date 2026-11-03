/**
 * Tests for the promotion on/off schedule and link checking.
 * Run: npx tsx scripts/test-promo-logic.ts
 */
import { isLive, cleanLink } from '../src/lib/promoLogic'

const NOW = Date.parse('2026-11-27T12:00:00Z')
const day = 86400e3
const iso = (ms: number) => new Date(ms).toISOString()

let failed = 0
function check(name: string, got: unknown, want: unknown) {
  const ok = JSON.stringify(got) === JSON.stringify(want)
  if (!ok) failed++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${ok ? '' : `  (got ${JSON.stringify(got)}, wanted ${JSON.stringify(want)})`}`)
}

// isLive: the master switch and schedule
check('switch off, no dates', isLive({ enabled: false }, NOW), false)
check('switch off, inside a window', isLive({ enabled: false, show_from: iso(NOW - day), show_until: iso(NOW + day) }, NOW), false)
check('switch on, no dates', isLive({ enabled: true }, NOW), true)
check('switch on, starts tomorrow', isLive({ enabled: true, show_from: iso(NOW + day) }, NOW), false)
check('switch on, started yesterday', isLive({ enabled: true, show_from: iso(NOW - day) }, NOW), true)
check('switch on, ended yesterday', isLive({ enabled: true, show_until: iso(NOW - day) }, NOW), false)
check('switch on, ends tomorrow', isLive({ enabled: true, show_until: iso(NOW + day) }, NOW), true)
check('switch on, inside a window', isLive({ enabled: true, show_from: iso(NOW - day), show_until: iso(NOW + day) }, NOW), true)
check('switch on, window not started', isLive({ enabled: true, show_from: iso(NOW + day), show_until: iso(NOW + 2 * day) }, NOW), false)
check('switch on, window already over', isLive({ enabled: true, show_from: iso(NOW - 2 * day), show_until: iso(NOW - day) }, NOW), false)
check('null / missing setting', isLive(null, NOW), false)
check('null dates are ignored', isLive({ enabled: true, show_from: null, show_until: null }, NOW), true)

// cleanLink: what may be linked to
check('site path', cleanLink('/boats', 'See'), { url: '/boats', label: 'See' })
check('site path with spaces around', cleanLink('  /boats  ', ' See '), { url: '/boats', label: 'See' })
check('https address', cleanLink('https://example.com/x', 'Go'), { url: 'https://example.com/x', label: 'Go' })
check('http address', cleanLink('http://example.com', 'Go'), { url: 'http://example.com', label: 'Go' })
check('javascript: refused', cleanLink('javascript:alert(1)', 'Go'), null)
check('protocol-relative refused', cleanLink('//evil.example/x', 'Go'), null)
check('data: refused', cleanLink('data:text/html,hi', 'Go'), null)
check('bare word refused', cleanLink('boats', 'Go'), null)
check('empty label refused', cleanLink('/boats', ''), null)
check('whitespace label refused', cleanLink('/boats', '   '), null)
check('empty address refused', cleanLink('', 'Go'), null)
check('undefined refused', cleanLink(undefined, undefined), null)

console.log(failed ? `\n${failed} FAILED` : '\nAll passed')
process.exit(failed ? 1 : 0)
