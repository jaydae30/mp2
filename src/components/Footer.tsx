import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>
        Movie data from{' '}
        <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer">
          TMDB
        </a>
        . This product uses the TMDB API but is not endorsed or certified by TMDB.
      </p>
      <p>
        Streaming availability provided by{' '}
        <a href="https://www.justwatch.com" target="_blank" rel="noopener noreferrer">
          JustWatch
        </a>
        .
      </p>
    </footer>
  )
}