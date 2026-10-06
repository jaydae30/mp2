import { IMAGE_BASE } from '../api/tmdb'
import type { WatchProvider } from '../types/tmdb'
import styles from './ServiceOption.module.css'

type Props = {
  provider: WatchProvider
  selected: boolean
  onToggle: (id: number) => void
}

export default function ServiceOption({ provider, selected, onToggle }: Props) {
  const className = selected ? `${styles.option} ${styles.selected}` : styles.option

  return (
    <button
      type="button"
      className={className}
      aria-pressed={selected}
      onClick={() => onToggle(provider.provider_id)}
    >
      <img
        src={`${IMAGE_BASE}w92${provider.logo_path}`}
        alt=""
        className={styles.logo}
      />
      <span className={styles.name}>{provider.provider_name}</span>
    </button>
  )
}