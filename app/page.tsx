// SSG — no dynamic functions used, this page is fully static and CDN-cached forever
import Link from 'next/link'
import { RenderingBadge } from '@/components/RenderingBadge'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-6 py-24">
      <RenderingBadge mode="SSG" />

      <div className="max-w-sm w-full text-center">
        <h1 className="text-5xl font-bold tracking-tight">Showtime</h1>
        <p className="mt-3 text-gray-400 text-lg">Track when your shows are on.</p>

        <div className="mt-10 flex flex-col gap-3">
          <Link href="/trending" className="w-full px-5 py-3 bg-white text-gray-950 rounded-lg font-medium text-sm hover:bg-gray-200 transition-colors">
            Browse Trending
          </Link>
          <Link href="/tonight" className="w-full px-5 py-3 bg-gray-900 text-white rounded-lg font-medium text-sm hover:bg-gray-800 transition-colors border border-gray-700">
            On Tonight
          </Link>
          <Link href="/watchlist" className="w-full px-5 py-3 bg-gray-900 text-white rounded-lg font-medium text-sm hover:bg-gray-800 transition-colors border border-gray-700">
            My Watchlist
          </Link>
        </div>
      </div>
    </main>
  )
}
