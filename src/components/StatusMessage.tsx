import type { ReactNode } from 'react'
import styles from './StatusMessage.module.css'

type Props = {
  kind: 'loading' | 'error' | 'empty'
  children: ReactNode
}

export default function StatusMessage({ kind, children }: Props) {
  return (
    <div
      className={`${styles.message} ${styles[kind]}`}
      role={kind === 'error' ? 'alert' : 'status'}
    >
      {kind === 'loading' && <span className={styles.spinner} aria-hidden="true" />}
      <span>{children}</span>
    </div>
  )
}