import { Link, NavLink } from 'react-router-dom'
import styles from './NavBar.module.css'

const LINKS = [
  { to: '/', label: 'Suggestions', end: true },
  { to: '/search', label: 'Search', end: false },
  { to: '/services', label: 'My Services', end: false },
]

export default function NavBar() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label="Main">
        <Link to="/" className={styles.brand}>
          StreamFinder
        </Link>
        <ul className={styles.links}>
          {LINKS.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  isActive ? `${styles.link} ${styles.active}` : styles.link
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}