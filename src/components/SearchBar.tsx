import styles from './SearchBar.module.css'

type Props = {
  value: string
  onChange: (value: string) => void
}

export default function SearchBar({ value, onChange }: Props) {
  return (
    <input
      type="search"
      className={styles.input}
      placeholder="Search for a movie..."
      aria-label="Search movies"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}