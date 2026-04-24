'use client'
import { useState, useEffect } from 'react'

function getWatchlist(): number[] {
  const match = document.cookie.split(/;\s*/).find(r => r.startsWith('watchlist='))
  if (!match) return []
  try {
    return JSON.parse(decodeURIComponent(match.slice('watchlist='.length)))
  } catch {
    return []
  }
}

function saveWatchlist(ids: number[]) {
  document.cookie = `watchlist=${encodeURIComponent(JSON.stringify(ids))}; path=/; max-age=${60 * 60 * 24 * 365 * 10}`
}

export function WatchlistButton({ showId }: { showId: number }) {
  const [inList, setInList] = useState(false)

  useEffect(() => {
    setInList(getWatchlist().includes(showId))
  }, [showId])

  function toggle() {
    const current = getWatchlist()
    const next = inList ? current.filter(id => id !== showId) : [...current, showId]
    saveWatchlist(next)
    setInList(!inList)
  }

  return (
    <button
      onClick={toggle}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        inList
          ? 'bg-gray-700 text-white hover:bg-gray-600'
          : 'bg-white text-gray-950 hover:bg-gray-200'
      }`}
    >
      {inList ? '✓ In Watchlist' : '+ Add to Watchlist'}
    </button>
  )
}
