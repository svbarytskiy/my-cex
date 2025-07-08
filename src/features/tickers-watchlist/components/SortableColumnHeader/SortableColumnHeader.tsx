import { FC, memo } from 'react'
import styles from './SortableColumnHeader.module.css'
import { SortDirectionIcon } from '../SortDirectionIcon/SortDirectionIcon'
import { SortDirection } from '../SortableTableHeader/SortableTableHeader'

interface SortableColumnHeaderProps {
  id: string
  label: string
  sortable: boolean
  isCurrentlySorted: boolean
  currentSortDirection: SortDirection
  onClick: (columnId: string) => void
}

const SortableColumnHeader: FC<SortableColumnHeaderProps> = memo(
  ({
    id,
    label,
    sortable,
    isCurrentlySorted,
    currentSortDirection,
    onClick,
  }) => {
    const handleLocalClick = () => {
      if (sortable) {
        onClick(id)
      }
    }

    return (
      <div
        className={`${styles.headerColumn} ${isCurrentlySorted ? styles.activeSort : ''}`}
      >
        <div
          className={`${styles.headerContent} ${sortable ? styles.sortable : ''}`}
          onClick={handleLocalClick}
          role={sortable ? 'button' : undefined}
          tabIndex={sortable ? 0 : undefined}
          aria-sort={
            isCurrentlySorted
              ? currentSortDirection === 'asc'
                ? 'ascending'
                : 'descending'
              : undefined
          }
          aria-label={`Sort by ${label} ${
            isCurrentlySorted
              ? currentSortDirection === 'asc'
                ? '(Currently ascending, click to sort descending or unsort)'
                : currentSortDirection === 'desc'
                  ? '(Currently descending, click to unsort or sort ascending)'
                  : '(Click to sort ascending)'
              : '(Click to sort ascending)'
          }`}
        >
          <div className={styles.columnLabel}>{label}</div>
          {sortable && (
            <SortDirectionIcon currentSortDirection={currentSortDirection} />
          )}
        </div>
      </div>
    )
  },
)

SortableColumnHeader.displayName = 'SortableColumnHeader'

export { SortableColumnHeader }
