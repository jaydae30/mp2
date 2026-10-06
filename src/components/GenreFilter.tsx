import type { Genre } from '../types/tmdb'
import styles from './GenreFilter.module.css'

type Props = {
  genres: Genre[]
  selectedIds: number[]
  onToggle: (id: number) => void
  onClear: () => void
}

export default function GenreFilter({ genres, selectedIds, onToggle, onClear }: Props) {
  return (
    <div className={styles.filter}>
      <div className={styles.header}>
        <span className={styles.label}>Genres</span>
        {selectedIds.length > 0 && (
          <button type="button" className={styles.clear} onClick={onClear}>
            Clear
          </button>
        )}
      </div>

      <div className={styles.chips} role="group" aria-label="Filter by genre">
        {genres.map((g) => {
          const selected = selectedIds.includes(g.id)
          return (
            <button
              key={g.id}
              type="button"
              aria-pressed={selected}
              className={selected ? `${styles.chip} ${styles.selected}` : styles.chip}
              onClick={() => onToggle(g.id)}
            >
              {g.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}