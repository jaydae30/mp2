import { useEffect, useState } from 'react'
import { tmdb } from '../api/tmdb'
import { useServices } from '../context/useServices'
import ServiceOption from '../components/ServiceOption'
import type { ProviderListResponse, WatchProvider } from '../types/tmdb'
import styles from './ServicesPage.module.css'

export default function ServicesPage() {
  const { serviceIds, toggleService } = useServices()
  const [providers, setProviders] = useState<WatchProvider[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    let ignore = false

    tmdb
      .get<ProviderListResponse>('/watch/providers/movie', {
        params: { watch_region: 'US' },
      })
      .then((res) => {
        if (ignore) return
        const sorted = [...res.data.results].sort(
          (a, b) => a.display_priority - b.display_priority,
        )
        setProviders(sorted)
      })
      .catch(() => {
        if (!ignore) setError('Could not load streaming services.')
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [])

    const query = filter.trim().toLowerCase()
  const visible = providers.filter((p) =>
    p.provider_name.toLowerCase().includes(query),
  )

  const selectedVisible = visible.filter((p) => serviceIds.includes(p.provider_id))
  const otherVisible = visible.filter((p) => !serviceIds.includes(p.provider_id))

  function renderGrid(list: WatchProvider[]) {
    return (
      <ul className={styles.grid}>
        {list.map((p) => (
          <li key={p.provider_id}>
            <ServiceOption
              provider={p}
              selected={serviceIds.includes(p.provider_id)}
              onToggle={toggleService}
            />
          </li>
        ))}
      </ul>
    )
  }

  return (
    <section className={styles.page}>
      <h1>My Services</h1>
      <p className={styles.hint}>
        Pick the services you have. Suggestions only show movies you can watch on these.
      </p>

      <p className={styles.count}>
        {serviceIds.length === 0
          ? 'No services selected. Pick at least one to get suggestions.'
          : `${serviceIds.length} selected`}
      </p>

      <input
        type="search"
        className={styles.filter}
        placeholder="Find a service..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      {loading && <p className={styles.status}>Loading services...</p>}
      {error && <p className={styles.status}>{error}</p>}
      {!loading && !error && visible.length === 0 && (
        <p className={styles.status}>No services match "{filter}".</p>
      )}

      {selectedVisible.length > 0 && (
        <>
          <h2 className={styles.sectionTitle}>Your services</h2>
          {renderGrid(selectedVisible)}
        </>
      )}

      {otherVisible.length > 0 && (
        <>
          <h2 className={styles.sectionTitle}>All services</h2>
          {renderGrid(otherVisible)}
        </>
      )}
    </section>
  )
}