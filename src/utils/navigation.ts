import type { MovieListState } from '../types/navigation'

export function isMovieListState(value: unknown): value is MovieListState {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  return (
    Array.isArray(v.ids) &&
    v.ids.every((n) => typeof n === 'number') &&
    typeof v.from === 'string' &&
    typeof v.backTo === 'string'
  )
}