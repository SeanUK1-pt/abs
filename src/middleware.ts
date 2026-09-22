import { type NextRequest, NextResponse } from 'next/server'
import { localePath } from '@/lib/localePath'
import { LEGACY_REDIRECTS } from '@/lib/legacyRedirects'

const LEGACY_MAP = new Map(LEGACY_REDIRECTS.map(r => [r.from, r.to]))

function isExcluded(pathname: string): boolean {
  return (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/media/') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    /\.\w+$/.test(pathname)
  )
}

// Strip a /pt-pt, /pt, or /en prefix (if present) so legacy paths can be
// matched regardless of which locale prefix the old URL was requested under.
function stripLocalePrefix(pathname: string): { locale: 'en' | 'pt'; bare: string } {
  if (/^\/pt-pt(\/|$)/i.test(pathname)) {
    return { locale: 'pt', bare: pathname.replace(/^\/pt-pt/i, '') || '/' }
  }
  if (/^\/pt(\/|$)/i.test(pathname)) {
    return { locale: 'pt', bare: pathname.replace(/^\/pt/i, '') || '/' }
  }
  if (/^\/en(\/|$)/i.test(pathname)) {
    return { locale: 'en', bare: pathname.replace(/^\/en/i, '') || '/' }
  }
  return { locale: 'en', bare: pathname }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (isExcluded(pathname)) return NextResponse.next()

  // ── Legacy WordPress/WooCommerce URLs — single-hop redirect straight to the
  //    locale-appropriate destination, regardless of which prefix (none,
  //    /pt, /pt-pt, /en) the old URL is requested under. Checked before the
  //    locale-normalization rules below so a /pt-pt/listings/... URL doesn't
  //    redirect twice (once to /pt/listings/..., then again to /pt/boats/...).
  const { locale, bare } = stripLocalePrefix(pathname)
  const normalizedBare = bare.length > 1 ? bare.replace(/\/+$/, '') : bare
  const legacyDest = LEGACY_MAP.get(normalizedBare)
  if (legacyDest) {
    // localePath('pt', '/') naively concatenates to '/pt/', which would take
    // an extra trailing-slash hop of its own — collapse that one case.
    let destPath = localePath(locale, legacyDest)
    if (destPath.length > 1 && destPath.endsWith('/')) destPath = destPath.slice(0, -1)
    const destUrl = new URL(destPath, req.url)
    if (req.nextUrl.search) destUrl.search = req.nextUrl.search
    return NextResponse.redirect(destUrl, 301)
  }

  // Normalize /pt-pt/* → /pt/*
  if (/^\/pt-pt(\/|$)/i.test(pathname)) {
    const newPath = pathname.replace(/^\/pt-pt/i, '/pt') || '/pt'
    return NextResponse.redirect(new URL(newPath, req.url), 301)
  }

  // /en/* → /* (canonical EN URL has no prefix)
  if (pathname.startsWith('/en/') || pathname === '/en') {
    const newPath = pathname.slice(3) || '/'
    return NextResponse.redirect(new URL(newPath, req.url), 301)
  }

  // /pt and /pt/* — already correct, let Next.js route to [locale]='pt'
  if (pathname.startsWith('/pt/') || pathname === '/pt') {
    return NextResponse.next()
  }

  // All other frontend paths: rewrite to /en prefix so [locale]/... sees locale='en'
  const rewritten = req.nextUrl.clone()
  rewritten.pathname = `/en${pathname === '/' ? '' : pathname}`
  return NextResponse.rewrite(rewritten)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico).*)'],
}
