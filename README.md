# Showtime

Track when your shows are on. Built with Next.js 16, TypeScript, and Tailwind CSS v4.

## Routes

| Route | Description |
|---|---|
| `/` | Home / landing |
| `/trending` | Trending shows |
| `/tonight` | What's on tonight |
| `/watchlist` | Your saved shows |
| `/shows/[slug]` | Individual show page |

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Notes

- Static pages are SSG/CDN-cached; a `RenderingBadge` component labels each page's render mode.
