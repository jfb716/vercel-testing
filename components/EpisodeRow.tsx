import type { Episode, Show } from '@/lib/tvmaze'

interface Props {
  episode: Episode
  show?: Show
}

function to12Hour(time: string): string {
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${String(m).padStart(2, '0')} ${period}`
}

export function EpisodeRow({ episode, show }: Props) {
  const network = show?.network?.name ?? show?.webChannel?.name ?? null
  const airtime = episode.airtime ? to12Hour(episode.airtime) : '—'

  return (
    <div className="flex items-center gap-4 px-5 py-3 text-sm">
      <span className="font-mono text-gray-500 w-20 shrink-0 text-left">
        {airtime}
      </span>
      {show && (
        <span className="text-white font-medium w-40 shrink-0 truncate">
          {show.name}
        </span>
      )}
      <span className="text-gray-400 flex-1 truncate">{episode.name}</span>
      <span className="text-gray-600 text-xs shrink-0">
        S{String(episode.season).padStart(2, '0')}E{String(episode.number).padStart(2, '0')}
      </span>
      {network && (
        <span className="text-gray-500 text-xs shrink-0 w-24 text-right truncate">{network}</span>
      )}
    </div>
  )
}
