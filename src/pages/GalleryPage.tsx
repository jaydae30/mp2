import { useEffect, useState } from 'react'
import { tmdb } from '../api/tmdb'
import { useServices } from '../context/useServices'
import GenreFilter from '../components/GenreFilter'
import ModeToggle from '../components/ModeToggle'
import ActorSearch from '../components/ActorSearch'
import StatusMessage from '../components/StatusMessage'
import MovieCard from '../components/MovieCard'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import type {
  Genre,
  GenreListResponse,
  MovieSummary,
  PagedResponse,
  Person,
} from '../types/tmdb'
import type { GalleryMode, MovieListState } from '../types/navigation'
import styles from './GalleryPage.module.css'

type FetchResult = {
  key: string
  movies: MovieSummary[]
  error: string | null
}

function parseGenreIds(value: string | null): number[] {
  if (!value) return []
  return value
    .split(',')
    .map(Number)
    .filter((n) => Number.isInteger(n) && n > 0)
}

export default function GalleryPage() {
  const { serviceIds } = useServices()
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()

  
  const mode: GalleryMode = searchParams.get('mode') === 'actor' ? 'actor' : 'genre'
  const actorParam = Number(searchParams.get('actor'))
  const actorId = Number.isInteger(actorParam) && actorParam > 0 ? actorParam : null
  const actorName = searchParams.get('actorName') ?? ''

  const selectedGenreIds = parseGenreIds(searchParams.get('genres'))

   
  const [genres, setGenres] = useState<Genre[]>([])
  const [genreError, setGenreError] = useState(false)

  useEffect(() => {
    let ignore = false
    tmdb
      .get<GenreListResponse>('/genre/movie/list')
      .then((res) => {
        if (!ignore) setGenres(res.data.genres)
      })
      .catch(() => {
        if (!ignore) setGenreError(true)
      })
    return () => {
      ignore = true
    }
  }, [])

  
  const providerParam = [...serviceIds].sort((a, b) => a - b).join('|')
  const genreParam = [...selectedGenreIds].sort((a, b) => a - b).join('|')

  
  const filterKey = mode === 'genre' ? `g:${genreParam}` : `a:${actorId ?? ''}`
  const requestKey = `${providerParam}#${filterKey}`

  const noServices = serviceIds.length === 0
  const needsActor = mode === 'actor' && actorId === null 
  const shouldFetch = !noServices && !needsActor 

  const [result, setResult] = useState<FetchResult | null>(null)

  useEffect(() => {
    if (!shouldFetch) return
    let ignore = false

    tmdb
      .get<PagedResponse<MovieSummary>>('/discover/movie', {
        params: {
          watch_region: 'US',
          with_watch_providers: providerParam,
          with_watch_monetization_types: 'flatrate|free|ads',
          with_genres: mode === 'genre' && genreParam ? genreParam : undefined, 
          with_cast: mode === 'actor' && actorId ? actorId : undefined, 
          sort_by: 'popularity.desc',
          include_adult: false,
        },
      })
      .then((res) => {
        if (!ignore) setResult({ key: requestKey, movies: res.data.results, error: null })
      })
      .catch(() => {
        if (!ignore)
          setResult({ key: requestKey, movies: [], error: 'Could not load suggestions.' })
      })

    return () => {
      ignore = true
    }
  }, [shouldFetch, providerParam, genreParam, mode, actorId, requestKey])

  
  function updateParams(changes: Record<string, string | null>) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        for (const [key, value] of Object.entries(changes)) {
          if (value) next.set(key, value)
          else next.delete(key)
        }
        return next
      },
      { replace: true },
    )
  }

  function setGenreIds(ids: number[]) {
    updateParams({ genres: ids.length > 0 ? ids.join(',') : null })
  }

  function toggleGenre(id: number) {
    setGenreIds(
      selectedGenreIds.includes(id)
        ? selectedGenreIds.filter((g) => g !== id)
        : [...selectedGenreIds, id],
    )
  }


  function changeMode(next: GalleryMode) {
    updateParams({
      mode: next === 'actor' ? 'actor' : null,
      genres: null,
      actor: null,
      actorName: null,
    })
  }

  
  function selectActor(person: Person) {
    updateParams({ actor: String(person.id), actorName: person.name })
  }

  
  function clearActor() {
    updateParams({ actor: null, actorName: null })
  }

  const loading = shouldFetch && (result === null || result.key !== requestKey)
  const movies = shouldFetch && !loading && result ? result.movies : []
  const listState: MovieListState = {
     ids: movies.map((m) => m.id),
     from: 'Suggestions',
     backTo: `${location.pathname}${location.search}`,
  }

  function emptyMessage() {
    if (mode === 'actor') {
      return `No movies with ${actorName || 'this actor'} on your services.`
    }
    return 'No movies match these genres on your services. Try removing a genre.'
  }

  return (
    <section className={styles.page}>
      <h1>Suggestions</h1>
      <p className={styles.hint}>Movies you can watch right now on your services.</p>

      {noServices ? (
                <StatusMessage kind="empty">
          You haven't picked any services yet.{' '}
          <Link to="/services">Choose your services</Link> to get suggestions.
        </StatusMessage>
      ) : (
        <>
          <ModeToggle mode={mode} onChange={changeMode} />

            {mode === 'genre' &&
            (genreError ? (
              <StatusMessage kind="error">Could not load genres.</StatusMessage>
            ) : genres.length === 0 ? (
              <StatusMessage kind="loading">Loading genres...</StatusMessage>
            ) : (
              <GenreFilter
                genres={genres}
                selectedIds={selectedGenreIds}
                onToggle={toggleGenre}
                onClear={() => setGenreIds([])}
              />
            ))}

          {mode === 'actor' &&
            (actorId ? (
              <div className={styles.selectedActor}>
                <span>
                  Movies with <strong>{actorName || 'selected actor'}</strong>
                </span>
                <button type="button" className={styles.changeActor} onClick={clearActor}>
                  Change actor
                </button>
              </div>
            ) : (
              <>
                <ActorSearch onSelect={selectActor} />
                  <StatusMessage kind="empty">Pick an actor to see their movies on your services.</StatusMessage>
              </>
            ))}

                    {loading && <StatusMessage kind="loading">Loading suggestions...</StatusMessage>}
          {!loading && result?.error && shouldFetch && (
            <StatusMessage kind="error">{result.error}</StatusMessage>
          )}
          {shouldFetch && !loading && !result?.error && movies.length === 0 && (
            <StatusMessage kind="empty">{emptyMessage()}</StatusMessage>
          )}

          <ul className={styles.grid}>
            {movies.map((m) => (
              <li key={m.id}>
                <MovieCard movie={m} listState={listState} />
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}