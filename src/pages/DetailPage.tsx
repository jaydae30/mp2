import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import axios from 'axios'
import { tmdb, IMAGE_BASE } from '../api/tmdb'
import { useServices } from '../context/useServices'
import { useMovieList } from '../hooks/useMovieList'
import { isMovieListState } from '../utils/navigation'
import WatchProviders from '../components/WatchProviders'
import PrevNextNav from '../components/PrevNextNav'
import type { MovieDetailsWithProviders } from '../types/tmdb'
import styles from './DetailPage.module.css'
import StatusMessage from '../components/StatusMessage'

type FetchResult = {
  id: string
  movie: MovieDetailsWithProviders | null
  error: string | null
}

function formatRuntime(minutes: number | null): string | null {
  if (!minutes) return null
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours === 0) return `${mins}m`
  return mins === 0 ? `${hours}h` : `${hours}h ${mins}m`
}

function formatDate(date: string): string | null {
  if (!date) return null
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

export default function DetailPage() {
  const { id = '' } = useParams()
  const location = useLocation()
  const { serviceIds } = useServices()
  const currentId = Number(id)
  const fromState = isMovieListState(location.state) ? location.state : null
  const list = useMovieList(currentId, fromState, serviceIds)
  const [result, setResult] = useState<FetchResult | null>(null)

  useEffect(() => {
    let ignore = false

    tmdb
      .get<MovieDetailsWithProviders>(`/movie/${id}`, {
        params: { append_to_response: 'watch/providers' },
      })
      .then((res) => {
        if (!ignore) setResult({ id, movie: res.data, error: null })
      })
      .catch((err) => {
        if (ignore) return
        const notFound = axios.isAxiosError(err) && err.response?.status === 404
        setResult({
          id,
          movie: null,
          error: notFound ? "We couldn't find that movie." : 'Could not load this movie.',
        })
      })

    return () => {
      ignore = true
    }
  }, [id])

  const topBar = (
    <div className={styles.topBar}>
      <Link to={list?.backTo ?? '/'} className={styles.back}>
        ← Back to {list?.from ?? 'Suggestions'}
      </Link>
      <PrevNextNav currentId={currentId} list={list} />
    </div>
  )

  if (result === null || result.id !== id) {
    return (
      <div className={styles.page}>
        {topBar}
          <StatusMessage kind="loading">Loading...</StatusMessage>
      </div>
    )
  }

  if (result.error || !result.movie) {
    return (
      <div className={styles.page}>
        {topBar}
          <StatusMessage kind="error">{result.error}</StatusMessage>
      </div>
    )
  }

  const movie = result.movie
  const year = movie.release_date ? movie.release_date.slice(0, 4) : null
  const meta = [
    formatDate(movie.release_date),
    formatRuntime(movie.runtime),
    movie.vote_average ? `★ ${movie.vote_average.toFixed(1)}` : null,
  ]
    .filter(Boolean)
    .join(' · ')
  const usProviders = movie['watch/providers']?.results.US

  return (
    <article className={styles.page}>
      {topBar}

      <div className={styles.layout}>
        {movie.poster_path ? (
          <img
            src={`${IMAGE_BASE}w500${movie.poster_path}`}
            alt={`${movie.title} poster`}
            className={styles.poster}
          />
        ) : (
          <div className={styles.noPoster}>No image</div>
        )}

        <div>
          <h1 className={styles.title}>
            {movie.title}
            {year && <span className={styles.year}> ({year})</span>}
          </h1>

          {movie.tagline && <p className={styles.tagline}>{movie.tagline}</p>}
          {meta && <p className={styles.meta}>{meta}</p>}

          {movie.genres.length > 0 && (
            <ul className={styles.genres}>
              {movie.genres.map((g) => (
                <li key={g.id} className={styles.genre}>
                  {g.name}
                </li>
              ))}
            </ul>
          )}

          <h2 className={styles.sectionTitle}>Overview</h2>
          <p className={styles.overview}>{movie.overview || 'No overview available.'}</p>

          <WatchProviders providers={usProviders} myServiceIds={serviceIds} />
        </div>
      </div>
    </article>
  )
}