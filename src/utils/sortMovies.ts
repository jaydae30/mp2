import type { MovieSummary } from '../types/tmdb'

export type SortKey = 'popularity' | 'vote_average' | 'release_date' | 'title'
export type SortDir = 'asc' | 'desc'

export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'popularity', label: 'Popularity' },
  { key: 'vote_average', label: 'Rating' },
  { key: 'release_date', label: 'Release date' },
  { key: 'title', label: 'Title' },
]

export function isSortKey(value: string | null): value is SortKey {
  return SORT_OPTIONS.some((o) => o.key === value)
}

export function sortMovies(
  movies: MovieSummary[],
  key: SortKey,
  dir: SortDir,
): MovieSummary[] {
  const sign = dir === 'asc' ? 1 : -1

  return [...movies].sort((a, b) => {
    if (key === 'title') {
      return a.title.localeCompare(b.title) * sign
    }

    if (key === 'release_date') {
      const aMissing = a.release_date === ''
      const bMissing = b.release_date === ''
      if (aMissing && bMissing) return 0
      if (aMissing) return 1 // unknown dates always go last
      if (bMissing) return -1
      return a.release_date.localeCompare(b.release_date) * sign
    }

    return (a[key] - b[key]) * sign
  })
}