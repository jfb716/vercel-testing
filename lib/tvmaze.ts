import { cacheLife } from 'next/cache'

const BASE = 'https://api.tvmaze.com'

export interface Show {
  id: number
  name: string
  type: string // e.g. "Scripted", "Talk Show", "News", "Reality", "Game Show"
  image: { medium: string; original: string } | null
  summary: string | null
  network: { name: string } | null
  webChannel: { name: string } | null
  genres: string[]
  rating: { average: number | null }
  premiered: string | null
}

export interface Episode {
  id: number
  name: string
  season: number
  number: number
  airdate: string
  airtime: string
  airstamp: string | null
  show?: Show
}

export async function getTrendingShows(): Promise<Show[]> {
  // ISR equivalent in Next.js 16 — "use cache" + cacheLife('hours') replaces export const revalidate = 3600
  'use cache'
  cacheLife('hours')
  const res = await fetch(`${BASE}/shows?page=0`)
  if (!res.ok) return []
  return res.json()
}

export async function getShowById(id: number): Promise<Show | null> {
  const res = await fetch(`${BASE}/shows/${id}`)
  if (!res.ok) return null
  return res.json()
}

export async function getShowBySlug(slug: string): Promise<Show | null> {
  // Cached — show metadata is the static shell of the PPR show detail page
  'use cache'
  cacheLife('days')
  const res = await fetch(`${BASE}/singlesearch/shows?q=${encodeURIComponent(slug)}`)
  if (!res.ok) return null
  return res.json()
}

export async function getEpisodesForShow(id: number): Promise<Episode[]> {
  const res = await fetch(`${BASE}/shows/${id}/episodes`)
  if (!res.ok) return []
  return res.json()
}

export async function getTonightSchedule(date: string): Promise<(Episode & { show: Show })[]> {
  // No "use cache" — this is the streaming page's data source, must be fresh on every request
  const res = await fetch(`${BASE}/schedule?country=US&date=${date}`)
  if (!res.ok) return []
  return res.json()
}

export async function searchShows(query: string): Promise<{ score: number; show: Show }[]> {
  const res = await fetch(`${BASE}/search/shows?q=${encodeURIComponent(query)}`)
  if (!res.ok) return []
  return res.json()
}
