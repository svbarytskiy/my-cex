import { FC } from 'react'
import styles from './SortChip.module.css'

interface SortChipProps {
  label: string
  isActive?: boolean
  onClick: () => void
}

const SortChip: FC<SortChipProps> = ({ label, isActive = false, onClick }) => {
  return (
    <button
      className={`${styles.sortChip} ${isActive ? styles.active : ''}`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  )
}

export { SortChip }
