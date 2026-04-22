'use client'
import { useState, useEffect } from 'react'

type Mode = 'SSG' | 'ISR' | 'SSR' | 'PPR' | 'Streaming' | 'Edge'

interface CheckItem {
  label: string
  delay: number
}

const config: Record<Mode, { description: string; checks: CheckItem[] }> = {
  SSG: {
    description: 'Built once, served from CDN forever.',
    checks: [
      { label: 'Pre-rendered at build time', delay: 150 },
      { label: 'Served from CDN edge',       delay: 300 },
      { label: 'Zero server load per visit',  delay: 450 },
    ],
  },
  ISR: {
    description: 'Cached HTML, revalidates every hour.',
    checks: [
      { label: 'Cached HTML served instantly', delay: 150 },
      { label: 'Trending data (1hr cache)',     delay: 300 },
      { label: 'Search results (dynamic)',      delay: 900 },
    ],
  },
  PPR: {
    description: 'Static shell + dynamic parts stream in.',
    checks: [
      { label: 'Nav shell (pre-rendered)', delay: 150 },
      { label: 'Show info (cached)',        delay: 500 },
      { label: 'Airing badge (live data)',  delay: 1000 },
      { label: 'Watchlist btn (cookie)',    delay: 1300 },
    ],
  },
  SSR: {
    description: 'Fully server-rendered on every request.',
    checks: [
      { label: 'Nav shell instant',          delay: 150 },
      { label: 'Cookie read server-side',    delay: 500 },
      { label: 'Watchlist fetched live',     delay: 800 },
    ],
  },
  Streaming: {
    description: 'Shell instant, content streams in via Suspense.',
    checks: [
      { label: 'Shell rendered immediately', delay: 150 },
      { label: 'Skeleton shown at once',     delay: 300 },
      { label: 'Episodes streamed in',       delay: 1400 },
    ],
  },
  Edge: {
    description: 'Runs at the network edge before the page.',
    checks: [
      { label: 'Cookie checked at edge', delay: 150 },
      { label: 'Redirect if no watchlist', delay: 300 },
    ],
  },
}

const colors: Record<Mode, { badge: string; check: string; panel: string }> = {
  SSG:       { badge: 'bg-green-900 text-green-300',   check: 'text-green-400',  panel: 'border-green-900' },
  ISR:       { badge: 'bg-blue-900 text-blue-300',     check: 'text-blue-400',   panel: 'border-blue-900' },
  SSR:       { badge: 'bg-orange-900 text-orange-300', check: 'text-orange-400', panel: 'border-orange-900' },
  PPR:       { badge: 'bg-purple-900 text-purple-300', check: 'text-purple-400', panel: 'border-purple-900' },
  Streaming: { badge: 'bg-teal-900 text-teal-300',     check: 'text-teal-400',   panel: 'border-teal-900' },
  Edge:      { badge: 'bg-yellow-900 text-yellow-300', check: 'text-yellow-400', panel: 'border-yellow-900' },
}

export function RenderingBadge({ mode }: { mode: Mode }) {
  const { description, checks } = config[mode]
  const { badge, check, panel } = colors[mode]
  const [checked, setChecked] = useState<boolean[]>(checks.map(() => false))

  useEffect(() => {
    const timers = checks.map((item, i) =>
      setTimeout(() => setChecked((prev) => {
        const next = [...prev]
        next[i] = true
        return next
      }), item.delay)
    )
    return () => timers.forEach(clearTimeout)
  }, [checks.length])

  return (
    <div className="fixed top-4 right-4 flex flex-col items-end gap-2 z-50">
      <span className={`px-3 py-1 rounded-full text-xs font-mono font-medium ${badge}`}>
        {mode}
      </span>

      <div className={`bg-gray-950 border ${panel} rounded-xl px-3 py-2.5 w-52 shadow-xl`}>
        <p className="text-gray-400 text-xs leading-snug mb-2">{description}</p>
        <ul className="space-y-1.5">
          {checks.map((item, i) => (
            <li key={item.label} className="flex items-center gap-2">
              <span className={`text-xs w-3.5 shrink-0 transition-opacity duration-300 ${checked[i] ? `${check} opacity-100` : 'opacity-0'}`}>
                ✓
              </span>
              <span className={`text-xs transition-colors duration-300 ${checked[i] ? 'text-gray-300' : 'text-gray-600'}`}>
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
