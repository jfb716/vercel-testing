// ISR — page shell and search form are cached; show grid is inside Suspense so search results can be dynamic
import { Suspense } from 'react'
import { getTrendingShows, searchShows } from '@/lib/tvmaze'
import { ShowCard } from '@/components/ShowCard'
import { RenderingBadge } from '@/components/RenderingBadge'
import { Nav } from '@/components/Nav'
import Link from 'next/link'

export default function TrendingPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  return (
    <main className="min-h-screen bg-gray-950 text-white px-6 py-12">
      <RenderingBadge mode="ISR" />

      <div className="max-w-4xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <Link href="/" className="text-gray-500 text-sm hover:text-gray-300 transition-colors">Showtime</Link>
            <h1 className="text-3xl font-bold mt-1">Trending Shows</h1>
          </div>
          <Nav current="trending" />
        </div>

        <form action="/trending" method="get" className="mb-8 flex gap-2">
          <input
            name="q"
            placeholder="Search shows to add to your watchlist…"
            autoComplete="off"
            className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-white text-gray-950 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Search
          </button>
        </form>

        <Suspense fallback={<GridSkeleton />}>
          {/* searchParams awaited here — inside Suspense so shell above stays ISR-cached */}
          <ShowGrid searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  )
}

async function ShowGrid({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams

  if (q) {
    const results = await searchShows(q)
    return (
      <div>
        <p className="text-gray-500 text-sm mb-4">
          {results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{q}&rdquo; &middot;{' '}
          <Link href="/trending" className="text-gray-400 hover:text-white transition-colors">clear</Link>
        </p>
        {results.length === 0 ? (
          <p className="text-gray-600 py-12 text-center">No shows found.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {results.map(({ show }) => (
              <ShowCard key={show.id} show={show} />
            ))}
          </div>
        )}
      </div>
    )
  }

  const shows = await getTrendingShows()
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {shows.map((show) => (
        <ShowCard key={show.id} show={show} />
      ))}
      {shows.length === 0 && (
        <p className="text-gray-500 col-span-full text-center py-24">Could not load shows.</p>
      )}
    </div>
  )
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {Array.from({ length: 10 }).map((_, i) => (
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
