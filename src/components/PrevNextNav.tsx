import { Link } from 'react-router-dom'
import type { MovieListState } from '../types/navigation'
import styles from './PrevNextNav.module.css'

type Props = {
  currentId: number
  list: MovieListState | null
}

export default function PrevNextNav({ currentId, list }: Props) {
  if (!list) return null

  const n = list.ids.length
  const index = list.ids.indexOf(currentId)
  if (index === -1 || n < 2) return null

  const prevId = list.ids[(index - 1 + n) % n]
  const nextId = list.ids[(index + 1) % n]

  return (
    <nav className={styles.nav} aria-label="Browse movies">
      <Link to={`/movie/${prevId}`} state={list} replace className={styles.button}>
        ← Previous
      </Link>
      <span className={styles.position}>
        {index + 1} of {n}
      </span>
      <Link to={`/movie/${nextId}`} state={list} replace className={styles.button}>
        Next →
      </Link>
    </nav>
  )
}