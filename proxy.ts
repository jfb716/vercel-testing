import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  // Protect /watchlist — if no watchlist cookie, user hasn't added shows yet
  // Redirect them to the landing page instead of showing an empty/broken state
  const watchlist = request.cookies.get('watchlist')

  if (request.nextUrl.pathname === '/watchlist' && !watchlist) {
    return NextResponse.redirect(new URL('/', request.url))
  }
}

export const config = {
  matcher: '/watchlist',
}
