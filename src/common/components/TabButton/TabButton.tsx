import { FC, memo } from 'react'
import styles from './TabButton.module.css'

interface TabButtonProps {
  label: string
  isActive: boolean
  onClick: (label: string) => void
}

const TabButton: FC<TabButtonProps> = memo(({ label, isActive, onClick }) => {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      className={`${styles.tabButton} ${isActive ? styles.active : ''}`}
      onClick={() => onClick(label)}
    >
      {label}
    </button>
  )
})

TabButton.displayName = 'TabButton'

export { TabButton }
