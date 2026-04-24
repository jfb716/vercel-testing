export function parseWatchlistCookie(value: string | undefined): number[] {
  if (!value) return []
  try {
    const parsed = JSON.parse(decodeURIComponent(value))
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}
