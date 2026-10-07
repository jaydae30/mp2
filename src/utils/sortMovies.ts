import type { MovieSummary } from '../types/tmdb'

export type SortKey = 'relevance' | 'popularity' | 'vote_average' | 'release_date' | 'title'
export type SortDir = 'asc' | 'desc'

export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'relevance', label: 'Best match' },
  { key: 'popularity', label: 'Popularity' },
  { key: 'vote_average', label: 'Rating' },
  { key: 'release_date', label: 'Release date' },
  { key: 'title', label: 'Title' },
]

export function isSortKey(value: string | null): value is SortKey {
  return SORT_OPTIONS.some((o) => o.key === value)
}

function matchScore(title: string, query: string): number {
  const t = title.toLowerCase()
  const q = query.trim().toLowerCase()
  if (!q) return 0
  if (t === q) return 3
  if (t.startsWith(q)) return 2
  if (t.split(/[^a-z0-9]+/).some((word) => word.startsWith(q))) return 1
  return 0
}

export function sortMovies(
  movies: MovieSummary[],
  key: SortKey,
  dir: SortDir,
  query: string,
): MovieSummary[] {
  const sign = dir === 'asc' ? 1 : -1

  return [...movies].sort((a, b) => {
    if (key === 'relevance') {
      const byScore = matchScore(a.title, query) - matchScore(b.title, query)
      return (byScore || a.popularity - b.popularity) * sign
    }

    if (key === 'title') {
      return a.title.localeCompare(b.title) * sign
    }

    if (key === 'release_date') {
      const aMissing = a.release_date === ''
      const bMissing = b.release_date === ''
      if (aMissing && bMissing) return 0
      if (aMissing) return 1
      if (bMissing) return -1
      return a.release_date.localeCompare(b.release_date) * sign
    }

    return (a[key] - b[key]) * sign
  })
}