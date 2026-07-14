import { type NextRequest, NextResponse } from 'next/server'

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

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (isExcluded(pathname)) return NextResponse.next()

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
