import Link from 'next/link'

type Page = 'trending' | 'tonight' | 'watchlist'

const LINKS: { href: string; label: string; page: Page }[] = [
  { href: '/trending', label: 'Trending',  page: 'trending'  },
  { href: '/tonight',  label: 'Tonight',   page: 'tonight'   },
  { href: '/watchlist',label: 'Watchlist', page: 'watchlist' },
]

export function Nav({ current }: { current?: Page }) {
  return (
    <nav className="flex items-center gap-1">
      {LINKS.filter((l) => l.page !== current).map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="px-3 py-1.5 text-sm text-gray-500 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )
}
