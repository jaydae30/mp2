import { Link } from 'react-router-dom'
import StatusMessage from '../components/StatusMessage'
import styles from './NotFoundPage.module.css'

export default function NotFoundPage() {
  return (
    <section className={styles.page}>
      <h1>Page not found</h1>
      <StatusMessage kind="empty">
        That page doesn't exist. <Link to="/">Go to Suggestions</Link>
      </StatusMessage>
    </section>
  )
}