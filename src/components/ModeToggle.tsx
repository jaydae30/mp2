import type { GalleryMode } from '../types/navigation'
import styles from './ModeToggle.module.css'

type Props = {
  mode: GalleryMode
  onChange: (mode: GalleryMode) => void
}

const OPTIONS: { value: GalleryMode; label: string }[] = [
  { value: 'genre', label: 'By genre' },
  { value: 'actor', label: 'By actor' },
]

export default function ModeToggle({ mode, onChange }: Props) {
  return (
    <div className={styles.toggle} role="group" aria-label="Browse suggestions by">
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={mode === o.value}
          className={mode === o.value ? `${styles.option} ${styles.active}` : styles.option}
          onClick={() => {
            if (mode !== o.value) onChange(o.value)
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}