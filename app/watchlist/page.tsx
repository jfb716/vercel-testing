// SSR — cookies() from next/headers makes this page fully personalized and never cached
//        Shell renders instantly; list content streams in via Suspense (same rule as all dynamic pages in Next.js 16)
import { Suspense } from 'react'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { getShowById, getEpisodesForShow } from '@/lib/tvmaze'
import type { Episode, Show } from '@/lib/tvmaze'
import { parseWatchlistCookie } from '@/lib/watchlist'
import { ShowCard } from '@/components/ShowCard'
import { RenderingBadge } from '@/components/RenderingBadge'
import { Nav } from '@/components/Nav'

export default function WatchlistPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white px-6 py-12">
      <RenderingBadge mode="SSR" />

      <div className="max-w-4xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <Link href="/" className="text-gray-500 text-sm hover:text-gray-300 transition-colors">Showtime</Link>
            <h1 className="text-3xl font-bold mt-1">My Watchlist</h1>
          </div>
          <Nav current="watchlist" />
        </div>

        <Suspense fallback={<WatchlistSkeleton />}>
          {/* cookies() lives here — inside Suspense so the shell above renders immediately */}
          <WatchlistContent />
        </Suspense>
      </div>
    </main>
  )
}

async function WatchlistContent() {
  const cookieStore = await cookies()
  const showIds = parseWatchlistCookie(cookieStore.get('watchlist')?.value)
  const today = new Date().toISOString().split('T')[0]

  if (showIds.length === 0) {
    return (
      <div className="text-center py-24">
        <p className="text-gray-400 text-lg">Your watchlist is empty.</p>
        <Link href="/trending" className="mt-4 inline-block text-white text-sm hover:text-gray-300 transition-colors">
          Browse trending shows →
        </Link>
      </div>
    )
  }

  const entries = await Promise.all(
    showIds.map(async (id) => {
      const [show, episodes] = await Promise.all([getShowById(id), getEpisodesForShow(id)])
      if (!show) return null
      const nextEpisode = episodes.find((e) => e.airdate >= today) ?? null
      return { show, nextEpisode }
    })
  )

  const valid = entries.filter(Boolean) as { show: Show; nextEpisode: Episode | null }[]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {valid.map(({ show, nextEpisode }) => (
        <div key={show.id}>
          <ShowCard show={show} />
          <div className="mt-1.5 px-1">
            {nextEpisode ? (
              <>
                <p className="text-gray-400 text-xs truncate">{nextEpisode.name}</p>
                <p className="text-gray-600 text-xs mt-0.5">{formatDate(nextEpisode.airdate)}</p>
              </>
            ) : (
              <p className="text-gray-700 text-xs">No upcoming episodes</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

function WatchlistSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[2/3] bg-gray-800 rounded-xl" />
          <div className="mt-2 space-y-1 px-1">
            <div className="h-3 bg-gray-800 rounded w-3/4" />
            <div className="h-3 bg-gray-800 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

function formatDate(airdate: string): string {
  const date = new Date(airdate + 'T12:00:00')
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}
