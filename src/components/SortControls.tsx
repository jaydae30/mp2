import { SORT_OPTIONS, isSortKey, type SortDir, type SortKey } from '../utils/sortMovies'
import styles from './SortControls.module.css'

type Props = {
  sortKey: SortKey
  sortDir: SortDir
  onSortKeyChange: (key: SortKey) => void
  onToggleDir: () => void
}

export default function SortControls({ sortKey, sortDir, onSortKeyChange, onToggleDir }: Props) {
  return (
    <div className={styles.controls}>
      <label className={styles.label}>
        Sort by
        <select
          className={styles.select}
          value={sortKey}
          onChange={(e) => {
            if (isSortKey(e.target.value)) onSortKeyChange(e.target.value)
          }}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.key} value={o.key}>
              {o.label}
            </option>
          ))}
        </select>
      </label>

      <button type="button" className={styles.dir} onClick={onToggleDir}>
        {sortDir === 'asc' ? '↑ Ascending' : '↓ Descending'}
      </button>
    </div>
  )
}