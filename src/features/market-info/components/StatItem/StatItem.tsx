import { FC, ReactNode } from 'react'
import styles from './StatItem.module.css'

interface StatItemProps {
  label: string
  value: string | number | ReactNode
}

const StatItem: FC<StatItemProps> = ({ label, value }) => {
  return (
    <>
      <div className={styles.marketInfo__stat}>
        <div className={styles.statLabel}>{label}</div>
        <div className={styles.statValue}>{value}</div>
      </div>
    </>
  )
}

export { StatItem }
