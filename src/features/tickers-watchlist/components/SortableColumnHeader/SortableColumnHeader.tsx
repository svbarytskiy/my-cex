import { FC, memo } from 'react'
import clsx from 'clsx'
import { SortDirectionIcon } from 'features/tickers-watchlist/ui/SortDirectionIcon/SortDirectionIcon'
import { SortDirection } from 'features/tickers-watchlist/types/model'

interface SortableColumnHeaderProps {
  id: string
  label: string
  sortable: boolean
  isCurrentlySorted: boolean
  currentSortDirection: SortDirection | null
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

    const headerColumnClasses = 'flex items-center max-w-full overflow-hidden truncate'

    const headerContentClasses = clsx(
      'flex items-center pr-[2px] overflow-hidden',
      {
        'cursor-pointer': sortable,
        group: sortable,
      },
    )

    const columnLabelClasses = clsx(
      'text-xs',
      'truncate',
      'flex-grow',
      'min-w-0',
      {
        'text-white': isCurrentlySorted,
      },
    )

    return (
      <div className={headerColumnClasses}>
        <div
          className={headerContentClasses}
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
          <div className={columnLabelClasses}>{label}</div>
          {sortable && (
            <div className="flex-shrink-0">
              <SortDirectionIcon currentSortDirection={currentSortDirection} className='flex-shrink-0' />
            </div>
          )}
        </div>
      </div>
    )
  },
)

SortableColumnHeader.displayName = 'SortableColumnHeader'

export { SortableColumnHeader }
