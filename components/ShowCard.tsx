import Link from 'next/link'
import type { Show } from '@/lib/tvmaze'

export function ShowCard({ show }: { show: Show }) {
  const network = show.network?.name ?? show.webChannel?.name ?? 'Unknown'

  return (
    <Link href={`/shows/${encodeURIComponent(show.name)}`} className="group">
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-600 transition-colors">
        <div className="aspect-[2/3] bg-gray-800 relative">
          {show.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={show.image.medium}
              alt={show.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm">
              No image
            </div>
          )}
        </div>
        <div className="p-3">
          <p className="text-white text-sm font-medium leading-tight group-hover:text-gray-200 line-clamp-1">
            {show.name}
          </p>
          <p className="text-gray-500 text-xs mt-1">{network}</p>
          {show.genres.length > 0 && (
            <p className="text-gray-600 text-xs mt-1 line-clamp-1">
              {show.genres.slice(0, 2).join(' · ')}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}
