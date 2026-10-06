import { useEffect, useState } from 'react'
import { tmdb } from '../api/tmdb'
import type { MovieSummary, PagedResponse } from '../types/tmdb'
import type { MovieListState } from '../types/navigation'

type Fallback = {
  key: string
  list: MovieListState | null
}

export function useMovieList(
  currentId: number,
  fromState: MovieListState | null,
  serviceIds: number[],
): MovieListState | null {
  const validId = Number.isInteger(currentId) && currentId > 0
  const hasValidState = fromState !== null && fromState.ids.includes(currentId)
  const providerParam = [...serviceIds].sort((a, b) => a - b).join('|')
  const key = `${currentId}#${providerParam}`
  const [fallback, setFallback] = useState<Fallback | null>(null)

  useEffect(() => {
    if (hasValidState || !validId) return
    let ignore = false

    const request = providerParam
      ? tmdb.get<PagedResponse<MovieSummary>>('/discover/movie', {
          params: {
            watch_region: 'US',
            with_watch_providers: providerParam,
            with_watch_monetization_types: 'flatrate|free|ads',
            sort_by: 'popularity.desc',
            include_adult: false,
          },
        })
      : tmdb.get<PagedResponse<MovieSummary>>('/movie/popular')

    request
      .then((res) => {
        if (ignore) return
        const others = res.data.results.map((m) => m.id).filter((mid) => mid !== currentId)
        setFallback({
          key,
          list: {
            ids: [currentId, ...others],
            from: providerParam ? 'Suggestions' : 'Search',
            backTo: providerParam ? '/' : '/search',
          },
        })
      })
      .catch(() => {
        if (!ignore) setFallback({ key, list: null })
      })

    return () => {
      ignore = true
    }
  }, [hasValidState, validId, currentId, providerParam, key])

  if (!validId) return null
  if (hasValidState) return fromState
  return fallback?.key === key ? fallback.list : null
}