import { Link } from 'react-router-dom'
import { IMAGE_BASE } from '../api/tmdb'
import type { MovieSummary } from '../types/tmdb'
import type { MovieListState } from '../types/navigation'
import styles from './MovieCard.module.css'

type Props = {
  movie: MovieSummary
  listState: MovieListState
}

export default function MovieCard({ movie, listState }: Props) {
  return (
    <Link to={`/movie/${movie.id}`} state={listState} className={styles.card}>
      {movie.poster_path ? (
        <img
          src={`${IMAGE_BASE}w342${movie.poster_path}`}
          alt=""
          className={styles.poster}
          loading="lazy"
        />
      ) : (
        <div className={styles.noPoster}>No image</div>
      )}
      <span className={styles.title}>{movie.title}</span>
    </Link>
  )
}