import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'

// Admin-only: turns on preview mode (a cookie in the admin's own browser) and
// opens the homepage. In preview mode the saved promotion shows even while
// "Show promotion" is off; everyone else still sees the live site.
export async function GET(req: NextRequest) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: req.headers })
  if (!user) {
    return new Response('Please log in to the admin at /admin first, then open the preview again.', {
      status: 401,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    })
  }

  ;(await draftMode()).enable()
  redirect(req.nextUrl.searchParams.get('locale') === 'pt' ? '/pt' : '/')
}
