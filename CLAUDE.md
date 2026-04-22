# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. 
Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. 
For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them. Don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" 
If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it. Don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]

Strong success criteria let you loop independently. 
Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, 
fewer rewrites due to overcomplication, and clarifying questions come 
before implementation rather than after mistakes.


## What This Project Is
A TV show tracking app called Showtime.
The user adds shows they watch and gets a clear view of what's airing this week and tonight.

The App — What It Does

Browse trending shows (pulled from TVmaze API)
View a show detail page with episode info
Add shows to a personal watchlist (stored in a cookie)
See your watchlist with this week's upcoming episodes
See a "tonight" page — everything airing today across your watchlist


Tech Stack

Next.js 16 (App Router)
TypeScript
Tailwind CSS for styling — keep it minimal and clean
TVmaze public API (no auth required) — https://api.tvmaze.com
No database — watchlist stored in a cookie as a JSON array of show IDs
No real auth — "session" is just the cookie


Rendering Mode Map — This Is the Core of the Project
Every page uses a specific rendering mode. This is intentional and must be preserved.
Add a small <RenderingBadge mode="SSG" /> component in the corner of every page.
RouteModeWhy/SSGStatic landing page. Never changes. CDN forever./trendingISR — revalidate 3600Trending shows change hourly. SEO matters./shows/[slug]PPRStatic show info + dynamic "airing tonight" badge + dynamic watchlist button/watchlistSSRReads cookie. Fully personalized. Cannot be cached./tonightStreamingShell instant. Episode list streams in from TVmaze.proxy.tsEdgeRedirect unauthenticated (no cookie) users from /watchlist to /

File Structure — Keep It Flat and Simple
/app
  /page.tsx                  → SSG  — landing page
  /trending/page.tsx         → ISR  — trending shows
  /shows/[slug]/page.tsx     → PPR  — show detail
  /watchlist/page.tsx        → SSR  — personal watchlist
  /tonight/page.tsx          → Streaming — what's on tonight

/components
  RenderingBadge.tsx         → small pill badge showing render mode
  ShowCard.tsx               → reusable show card used on trending + watchlist
  EpisodeRow.tsx             → reusable episode row used on tonight + show detail
  WatchlistButton.tsx        → 'use client' — add/remove from watchlist via cookie

/lib
  tvmaze.ts                  → all TVmaze API fetch functions, clearly named
  watchlist.ts               → cookie read/write helpers for watchlist

/proxy.ts                    → edge middleware — auth redirect
/next.config.ts              → cacheComponents: true

Coding Rules — Read These Carefully
Simplicity first

Each file should do one thing
No abstractions unless something is used 3+ times
No external state management libraries — cookie + React state only
No unnecessary comments — the code should be self-explanatory
DO add a single comment above any line that sets a rendering mode explaining WHY

Rendering signals — use these exactly
ts// SSG — no special code needed, just don't use dynamic functions
// ISR — one export at the top of the file
export const revalidate = 3600

// SSR — use cookies() from next/headers, this opts the page into SSR automatically
import { cookies } from 'next/headers'

// PPR — set in next.config.ts, then use <Suspense> for dynamic parts
// Streaming — wrap slow components in <Suspense> with a fallback skeleton

// 'use client' — top of file, for WatchlistButton only
'use client'
TVmaze API — use these endpoints only
ts// Trending shows
GET https://api.tvmaze.com/shows?page=0

// Show detail by ID
GET https://api.tvmaze.com/shows/:id

// Show detail by slug (use this for [slug] routes)
GET https://api.tvmaze.com/singlesearch/shows?q=:name

// Episodes for a show
GET https://api.tvmaze.com/shows/:id/episodes

// Tonight's schedule
GET https://api.tvmaze.com/schedule?country=US&date=YYYY-MM-DD
Watchlist cookie

Cookie name: watchlist
Value: JSON array of TVmaze show IDs — e.g. [1, 82, 526]
Set/read in /lib/watchlist.ts
WatchlistButton.tsx is the only 'use client' component — it reads and writes the cookie client-side using js-cookie or document.cookie directly

Styling

Tailwind only
Dark background — bg-gray-950 for the app shell
Cards: bg-gray-900 with a subtle border
Keep it clean — this is a demo, not a portfolio piece
Mobile layout is fine to ignore for now

RenderingBadge component
tsx// components/RenderingBadge.tsx
// Small pill in the top-right corner of every page
// Color codes: SSG=green, ISR=blue, SSR=orange, PPR=purple, Streaming=teal, Edge=yellow

type Mode = 'SSG' | 'ISR' | 'SSR' | 'PPR' | 'Streaming' | 'Edge'

export function RenderingBadge({ mode }: { mode: Mode }) {
  const colors = {
    SSG:       'bg-green-900 text-green-300',
    ISR:       'bg-blue-900 text-blue-300',
    SSR:       'bg-orange-900 text-orange-300',
    PPR:       'bg-purple-900 text-purple-300',
    Streaming: 'bg-teal-900 text-teal-300',
    Edge:      'bg-yellow-900 text-yellow-300',
  }
  return (
    <span className={`fixed top-4 right-4 px-3 py-1 rounded-full text-xs font-mono font-medium ${colors[mode]}`}>
      {mode}
    </span>
  )
}

What Each Page Should Look Like
/ — Landing (SSG)

App name + one line description
"What's on tonight" teaser — static, hardcoded, just a visual
Link to /trending and /watchlist
RenderingBadge mode="SSG"

/trending — Trending Shows (ISR)

Grid of ShowCards pulled from TVmaze
Each card links to /shows/[slug]
RenderingBadge mode="ISR"

/shows/[slug] — Show Detail (PPR)

Static: show name, network, summary, poster image, genre tags
Dynamic (inside Suspense): "New episode tonight at 8pm" badge OR "Next episode: Tuesday"
Dynamic (inside Suspense): WatchlistButton — "Add to Watchlist" / "Remove"
RenderingBadge mode="PPR"

/watchlist — Your Watchlist (SSR)

Reads watchlist cookie server-side
Shows list of your shows with next upcoming episode for each
Empty state if no cookie
RenderingBadge mode="SSR"

/tonight — On Tonight (Streaming)

Page shell and heading render instantly
Episode list wrapped in Suspense — streams in from TVmaze schedule API
Each row: show name, episode title, air time, network
Skeleton loader as fallback
RenderingBadge mode="Streaming"


next.config.ts
tsimport type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true, // enables PPR as default behavior — Next.js 16
}

export default nextConfig

proxy.ts (Edge Middleware)
tsimport { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  // Protect /watchlist — if no watchlist cookie, user hasn't set up yet
  // Redirect them to the landing page instead of showing an empty/broken state
  const watchlist = request.cookies.get('watchlist')

  if (request.nextUrl.pathname === '/watchlist' && !watchlist) {
    return NextResponse.redirect(new URL('/', request.url))
  }
}

export const config = {
  matcher: '/watchlist',
}


Build Order
Build in this order — each step is deployable:

next.config.ts + proxy.ts + RenderingBadge.tsx + /lib/tvmaze.ts
/ landing page (SSG)
/trending (ISR) + ShowCard.tsx
/tonight (Streaming) + EpisodeRow.tsx
/shows/[slug] (PPR) + WatchlistButton.tsx
/watchlist (SSR)
Polish styling + verify all badges show correct mode
Deploy to Vercel, verify each page's rendering mode in build output


Definition of Done

All 6 routes exist and are deployed on Vercel
Each page has a RenderingBadge showing the correct mode
Each page file has a comment block explaining the rendering choice
TVmaze data is real — not mocked
Watchlist persists across page refreshes via cookie
proxy.ts redirects users with no watchlist cookie away from /watchlist