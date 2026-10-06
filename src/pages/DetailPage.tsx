import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { tmdb } from '../api/tmdb'
import type { MovieDetails } from '../types/tmdb'


export default function DetailPage() {
  const { id } = useParams()
  const [movie, setMovie] = useState<MovieDetails | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let ignore = false

    tmdb
      .get<MovieDetails>(`/movie/${id}`)
      .then((res) => {
        if (!ignore) setMovie(res.data)
      })
      .catch(() => {
        if (!ignore) setError('Could not load this movie.')
      })

    return () => {
      ignore = true
    }
  }, [id])

  if (error) return <p>{error}</p>
  if (!movie) return <p>Loading...</p>

  return (
    <>
      <h1>{movie.title}</h1>
      <p>{movie.overview}</p>
    </>
  )
}