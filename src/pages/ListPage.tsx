import { useEffect, useState } from 'react'
import { tmdb } from '../api/tmdb'
import { useDebounce } from '../hooks/useDebounce'
import { sortMovies, isSortKey, type SortDir, type SortKey } from '../utils/sortMovies'
import SearchBar from '../components/SearchBar'
import SortControls from '../components/SortControls'
import MovieListItem from '../components/MovieListItem'
import type { MovieSummary, PagedResponse } from '../types/tmdb'
import type { MovieListState } from '../types/navigation'
import styles from './ListPage.module.css'
import { useLocation, useSearchParams } from 'react-router-dom'
import StatusMessage from '../components/StatusMessage'

type FetchResult = {
  query: string
  movies: MovieSummary[]
  error: string | null
}

export default function ListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()

  
  const urlQuery = searchParams.get('q') ?? ''
  const sortParam = searchParams.get('sort')
  const sortKey: SortKey = isSortKey(sortParam) ? sortParam : 'relevance'
  const sortDir: SortDir = searchParams.get('dir') === 'asc' ? 'asc' : 'desc'

  
  const [text, setText] = useState(urlQuery)
  const debouncedText = useDebounce(text, 300)

  function setParam(key: string, value: string) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (value) next.set(key, value)
        else next.delete(key)
        return next
      },
      { replace: true },
    )
  }

  
  useEffect(() => {
    const trimmed = debouncedText.trim()
    if (trimmed !== urlQuery) setParam('q', trimmed)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedText])

  const [result, setResult] = useState<FetchResult | null>(null)

  useEffect(() => {
    let ignore = false

    const request = urlQuery
      ? tmdb.get<PagedResponse<MovieSummary>>('/search/movie', {
          params: { query: urlQuery, include_adult: false },
        })
      : tmdb.get<PagedResponse<MovieSummary>>('/movie/popular')

    request
      .then((res) => {
        if (!ignore) setResult({ query: urlQuery, movies: res.data.results, error: null })
      })
      .catch(() => {
        if (!ignore) setResult({ query: urlQuery, movies: [], error: 'Could not load movies.' })
      })

    return () => {
      ignore = true
    }
  }, [urlQuery])

  const loading = result === null || result.query !== urlQuery
  const sorted = !loading && result ? sortMovies(result.movies, sortKey, sortDir, urlQuery) : []
  const listState: MovieListState = {
    ids: sorted.map((m) => m.id),
    from: 'Search',
    backTo: `${location.pathname}${location.search}`,
  }

  return (
    <section className={styles.page}>
      <h1>Search</h1>
      <p className={styles.hint}>Find any movie and see where it's streaming.</p>

      <div className={styles.toolbar}>
        <SearchBar value={text} onChange={setText} />
        <SortControls
          sortKey={sortKey}
          sortDir={sortDir}
          onSortKeyChange={(key) => setParam('sort', key)}
          onToggleDir={() => setParam('dir', sortDir === 'asc' ? 'desc' : 'asc')}
        />
      </div>

      <p className={styles.caption}>
        {urlQuery ? `Results for "${urlQuery}"` : 'Popular movies'}
      </p>

      {loading && <StatusMessage kind="loading">Loading...</StatusMessage>}
      {!loading && result?.error && <StatusMessage kind="error">{result.error}</StatusMessage>}
      {!loading && !result?.error && sorted.length === 0 && (
        <StatusMessage kind="empty">No movies found for "{urlQuery}".</StatusMessage>
      )}

      <ul className={styles.list}>
        {sorted.map((m) => (
          <li key={m.id}>
            <MovieListItem movie={m} listState={listState} />
          </li>
        ))}
      </ul>
    </section>
  )
}