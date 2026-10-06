import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { tmdb } from '../api/tmdb'

type MovieTest = {
  id: number
  title: string
  overview: string
}

export default function DetailPage() {
  const { id } = useParams()
  const [movie, setMovie] = useState<MovieTest | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let ignore = false

    tmdb
      .get<MovieTest>(`/movie/${id}`)
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