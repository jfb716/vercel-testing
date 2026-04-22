// Streaming — shell renders instantly, episode list streams in from TVmaze schedule API via Suspense
import { Suspense } from 'react'
import Link from 'next/link'
import { connection } from 'next/server'
import { getTonightSchedule } from '@/lib/tvmaze'
import { EpisodeRow } from '@/components/EpisodeRow'
import { RenderingBadge } from '@/components/RenderingBadge'
import { Nav } from '@/components/Nav'

// Shell is synchronous — renders immediately with no dynamic calls
export default function TonightPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white px-6 py-12">
      <RenderingBadge mode="Streaming" />

      <div className="max-w-4xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <Link href="/" className="text-gray-500 text-sm hover:text-gray-300 transition-colors">Showtime</Link>
            <h1 className="text-3xl font-bold mt-1">On Tonight</h1>
          </div>
          <Nav current="tonight" />
        </div>

        <Suspense fallback={<EpisodeSkeleton />}>
          {/* EpisodeList is async — dynamic calls live here, inside Suspense, so the shell above is never blocked */}
          <EpisodeList />
        </Suspense>
      </div>
    </main>
  )
}

async function EpisodeList() {
  // connection() and new Date() must be inside Suspense, not in the page shell
  await connection()
  const today = new Date().toISOString().split('T')[0]
  const schedule = await getTonightSchedule(today)

  // Scripted only — excludes talk shows, news, game shows, sports etc.
  const scripted = schedule.filter((item) => item.show?.type === 'Scripted')

  if (scripted.length === 0) {
    return <p className="text-gray-500 text-center py-12">No scripted shows tonight.</p>
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden divide-y divide-gray-800">
      <div className="px-5 py-2 border-b border-gray-800">
        <span className="text-gray-500 text-xs font-mono">{today} · scripted</span>
      </div>
      {scripted.map((item) => (
        <EpisodeRow key={item.id} episode={item} show={item.show} />
      ))}
    </div>
  )
}

function EpisodeSkeleton() {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden divide-y divide-gray-800">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-4 animate-pulse">
          <div className="h-3 w-12 bg-gray-800 rounded" />
          <div className="h-3 w-36 bg-gray-800 rounded" />
          <div className="h-3 bg-gray-800 rounded flex-1" />
          <div className="h-3 w-10 bg-gray-800 rounded" />
          <div className="h-3 w-20 bg-gray-800 rounded" />
        </div>
      ))}
    </div>
  )
}
