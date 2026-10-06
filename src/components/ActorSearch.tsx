import { useEffect, useState } from 'react'
import { tmdb, IMAGE_BASE } from '../api/tmdb'
import { useDebounce } from '../hooks/useDebounce'
import type { PagedResponse, Person } from '../types/tmdb'
import styles from './ActorSearch.module.css'

type Props = {
  onSelect: (person: Person) => void
}

type SearchResult = {
  query: string
  people: Person[]
  error: string | null
}

export default function ActorSearch({ onSelect }: Props) {
  const [text, setText] = useState('')
  const query = useDebounce(text.trim(), 300)
  const [result, setResult] = useState<SearchResult | null>(null)

  useEffect(() => {
    if (!query) return
    let ignore = false

    tmdb
      .get<PagedResponse<Person>>('/search/person', {
        params: { query, include_adult: false },
      })
      .then((res) => {
        if (ignore) return
        const actors = res.data.results
          .filter((p) => p.known_for_department === 'Acting')
          .slice(0, 8)
        setResult({ query, people: actors, error: null })
      })
      .catch(() => {
        if (!ignore) setResult({ query, people: [], error: 'Could not search actors.' })
      })

    return () => {
      ignore = true
    }
  }, [query])

  const loading = query !== '' && (result === null || result.query !== query)
  const people = query && !loading && result ? result.people : []

  return (
    <div className={styles.search}>
      <input
        type="search"
        className={styles.input}
        placeholder="Search for an actor..."
        aria-label="Search actors"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      {loading && <p className={styles.status}>Searching...</p>}
      {!loading && result?.error && query && <p className={styles.status}>{result.error}</p>}
      {!loading && query && !result?.error && people.length === 0 && (
        <p className={styles.status}>No actors found for "{query}".</p>
      )}

      <ul className={styles.results}>
        {people.map((p) => (
          <li key={p.id}>
            <button type="button" className={styles.person} onClick={() => onSelect(p)}>
              {p.profile_path ? (
                <img src={`${IMAGE_BASE}w45${p.profile_path}`} alt="" className={styles.photo} />
              ) : (
                <span className={styles.noPhoto} aria-hidden="true">?</span>
              )}
              <span>{p.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}