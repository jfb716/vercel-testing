// PPR — nav shell pre-rendered instantly; show content streams in (cached after first hit via "use cache" on getShowBySlug);
//        airing badge + watchlist button stream in via nested Suspense
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { connection } from 'next/server'
import Link from 'next/link'
import { getShowBySlug, getTonightSchedule, getEpisodesForShow } from '@/lib/tvmaze'
import { WatchlistButton } from '@/components/WatchlistButton'
import { RenderingBadge } from '@/components/RenderingBadge'
import { Nav } from '@/components/Nav'

// Shell is synchronous — params access is a runtime value, must go inside Suspense
export default function ShowPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <main className="min-h-screen bg-gray-950 text-white px-6 py-12">
      <RenderingBadge mode="PPR" />

      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="text-gray-500 text-sm hover:text-gray-300 transition-colors">Showtime</Link>
          <Nav />
        </div>

        <Suspense fallback={<ShowSkeleton />}>
          <ShowContent params={params} />
        </Suspense>
      </div>
    </main>
  )
}

async function ShowContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const show = await getShowBySlug(decodeURIComponent(slug))

  if (!show) notFound()

  const network = show.network?.name ?? show.webChannel?.name ?? null
  const summary = show.summary?.replace(/<[^>]+>/g, '') ?? null

  return (
    <div className="mt-6 flex flex-col gap-8">
      <div className="flex gap-8 items-start">
        {show.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={show.image.original}
            alt={show.name}
            className="w-44 rounded-xl shrink-0 object-cover"
          />
        )}

        <div className="flex-1">
          <h1 className="text-3xl font-bold">{show.name}</h1>

          {network && <p className="text-gray-400 mt-1">{network}</p>}

          {show.genres.length > 0 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {show.genres.map((g) => (
                <span key={g} className="px-2 py-0.5 bg-gray-800 text-gray-400 text-xs rounded-full">
                  {g}
                </span>
              ))}
            </div>
          )}

          {/* Dynamic: airing tonight badge or next episode info */}
          <div className="mt-4 h-7">
            <Suspense fallback={null}>
              <AiringBadge showId={show.id} />
            </Suspense>
          </div>

          {/* Client component — no Suspense needed, doesn't suspend server-side */}
          <div className="mt-4">
            <WatchlistButton showId={show.id} />
          </div>
        </div>
      </div>

      {summary && (
        <p className="text-gray-300 leading-relaxed text-sm">{summary}</p>
      )}
    </div>
  )
}

async function AiringBadge({ showId }: { showId: number }) {
  await connection()
  const today = new Date().toISOString().split('T')[0]

  const [schedule, episodes] = await Promise.all([
    getTonightSchedule(today),
    getEpisodesForShow(showId),
  ])

  const tonightEp = schedule.find((e) => e.show?.id === showId)

  if (tonightEp) {
    const time = tonightEp.airtime ? to12Hour(tonightEp.airtime) : ''
    return (
      <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-900 text-green-300 text-sm rounded-full">
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        New episode tonight{time ? ` at ${time}` : ''}
      </span>
    )
  }

  const nextEp = episodes.find((e) => e.airdate > today)
  if (nextEp) {
    const date = new Date(nextEp.airdate + 'T12:00:00')
    const label = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    return <span className="text-gray-400 text-sm">Next episode: {label}</span>
  }

  return null
}

function ShowSkeleton() {
  return (
    <div className="mt-6 flex gap-8 animate-pulse">
      <div className="w-44 aspect-[2/3] bg-gray-800 rounded-xl shrink-0" />
      <div className="flex-1 space-y-3 pt-1">
        <div className="h-8 bg-gray-800 rounded w-3/4" />
        <div className="h-4 bg-gray-800 rounded w-1/4" />
        <div className="flex gap-2 mt-3">
          <div className="h-5 w-16 bg-gray-800 rounded-full" />
          <div className="h-5 w-20 bg-gray-800 rounded-full" />
        </div>
        <div className="h-9 w-36 bg-gray-800 rounded-lg mt-4" />
      </div>
    </div>
  )
}

function to12Hour(time: string): string {
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${String(m).padStart(2, '0')} ${period}`
}
