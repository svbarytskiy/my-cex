import { FC, memo } from 'react'
import styles from './SortDirectionIcon.module.css'
import { SortDirection } from '../SortableTableHeader/SortableTableHeader'

interface SortDirectionIconProps {
  currentSortDirection: SortDirection // 'asc', 'desc', or null
}

const SortDirectionIcon: FC<SortDirectionIconProps> = memo(
  ({ currentSortDirection }) => {
    return (
      <svg
        className={styles.sortIconSvg}
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className={`${styles.arrowUp} ${currentSortDirection === 'asc' ? styles.activeArrow : ''}`}
          d="M8.75 8.849V10.5h6.5V8.85L12 5.348l-3.25 3.5z"
          fill="currentColor"
        />

        <path
          className={`${styles.arrowDown} ${currentSortDirection === 'desc' ? styles.activeArrow : ''}`}
          d="M8.75 15.151V13.5h6.5v1.652l-3.25 3.5-3.25-3.5z"
          fill="currentColor"
        />
      </svg>
    )
  },
)

SortDirectionIcon.displayName = 'SortDirectionIcon'

export { SortDirectionIcon }
