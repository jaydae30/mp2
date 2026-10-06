import { Link } from 'react-router-dom'
import { IMAGE_BASE } from '../api/tmdb'
import type { MovieSummary } from '../types/tmdb'
import type { MovieListState } from '../types/navigation'
import styles from './MovieListItem.module.css'

type Props = {
  movie: MovieSummary
  listState: MovieListState
}

export default function MovieListItem({ movie, listState }: Props) {
  const year = movie.release_date ? movie.release_date.slice(0, 4) : 'Unknown year'

  return (
    <Link to={`/movie/${movie.id}`} state={listState} className={styles.item}>
      {movie.poster_path ? (
        <img src={`${IMAGE_BASE}w92${movie.poster_path}`} alt="" className={styles.poster} />
      ) : (
        <div className={styles.noPoster}>No image</div>
      )}
      <div>
        <h2 className={styles.title}>{movie.title}</h2>
        <p className={styles.meta}>
          {year} · ★ {movie.vote_average.toFixed(1)}
        </p>
      </div>
    </Link>
  )
}