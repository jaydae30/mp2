import { IMAGE_BASE } from '../api/tmdb'
import type { CountryProviders, WatchProvider } from '../types/tmdb'
import styles from './WatchProviders.module.css'

type Props = {
  providers: CountryProviders | undefined
  myServiceIds: number[]
}

function mergeUnique(...lists: (WatchProvider[] | undefined)[]): WatchProvider[] {
  const seen = new Set<number>()
  const merged: WatchProvider[] = []
  for (const list of lists) {
    for (const p of list ?? []) {
      if (!seen.has(p.provider_id)) {
        seen.add(p.provider_id)
        merged.push(p)
      }
    }
  }
  return merged
}

export default function WatchProviders({ providers, myServiceIds }: Props) {
  const isMine = (p: WatchProvider) => myServiceIds.includes(p.provider_id)

  const order = (list: WatchProvider[]) =>
    [...list].sort(
      (a, b) =>
        Number(isMine(b)) - Number(isMine(a)) || a.display_priority - b.display_priority,
    )

  const stream = providers?.flatrate ?? []
  const free = mergeUnique(providers?.free, providers?.ads)

  const groups = [
    { label: 'Stream', list: order(stream) },
    { label: 'Free', list: order(free) },
    { label: 'Rent', list: order(providers?.rent ?? []) },
    { label: 'Buy', list: order(providers?.buy ?? []) },
  ].filter((g) => g.list.length > 0)

  const onMyServices = [...stream, ...free].some(isMine)

  return (
    <section className={styles.providers}>
      <h2 className={styles.heading}>Where to watch</h2>

      {groups.length === 0 ? (
        <p>Not available to stream, rent, or buy in the US right now.</p>
      ) : (
        <>
          <p className={onMyServices ? styles.yes : styles.no}>
            {onMyServices ? '✓ Available on your services' : 'Not on your services'}
          </p>

          {groups.map((g) => (
            <div key={g.label} className={styles.group}>
              <h3 className={styles.groupLabel}>{g.label}</h3>
              <ul className={styles.list}>
                {g.list.map((p) => (
                  <li key={p.provider_id}>
                    <a
                      href={providers?.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={isMine(p) ? `${styles.provider} ${styles.mine}` : styles.provider}
                    >
                      <img src={`${IMAGE_BASE}w92${p.logo_path}`} alt="" className={styles.logo} />
                      <span>{p.provider_name}</span>
                      {isMine(p) && <span className={styles.badge}>Yours</span>}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </>
      )}

      <p className={styles.credit}>
        Streaming availability provided by{' '}
        <a href="https://www.justwatch.com" target="_blank" rel="noopener noreferrer">
          JustWatch
        </a>
        .
        {providers?.link && (
          <>
            {' '}
            <a href={providers.link} target="_blank" rel="noopener noreferrer">
              See all options
            </a>
          </>
        )}
      </p>
    </section>
  )
}