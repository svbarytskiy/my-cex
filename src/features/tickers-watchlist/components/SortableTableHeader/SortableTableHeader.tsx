import { FC, memo, useState, useCallback } from 'react'
import { SortableColumnHeader } from '../SortableColumnHeader/SortableColumnHeader'
import { OneColumnWrapper } from '../../ui/OneColumnWrapper/OneColumnWrapper'
import { SeparatorColumnWrapper } from '../../ui/SeparatorColumnWrapper/SeparatorColumnWrapper'
import { SortDirection } from 'features/tickers-watchlist/types/model'
import { COLUMNS_DEFINITIONS } from 'features/tickers-watchlist/constants'

interface SortableTableHeaderProps {
  initialSortBy: string | null
  initialSortDirection: SortDirection
  onSortChange?: (sortBy: string | null, sortDirection: SortDirection) => void
}

const SortableTableHeader: FC<SortableTableHeaderProps> = memo(
  ({ initialSortBy, initialSortDirection = null, onSortChange }) => {
    type ColumnId = keyof typeof COLUMNS_DEFINITIONS
    const [sortBy, setSortBy] = useState<string | null>(initialSortBy)
    const [sortDirection, setSortDirection] =
      useState<SortDirection>(initialSortDirection)

    const handleColumnClick = useCallback(
      (columnId: string) => {
        const column = COLUMNS_DEFINITIONS[columnId as ColumnId]
        if (!column || !column.sortable) {
          return
        }

        let newSortBy: ColumnId | null = columnId as ColumnId
        let newSortDirection: SortDirection = 'desc'

        if (sortBy === columnId) {
          if (sortDirection === 'desc') {
            newSortDirection = 'asc'
          } else if (sortDirection === 'asc') {
            newSortBy = null
            newSortDirection = null
          }
        }

        setSortBy(newSortBy)
        setSortDirection(newSortDirection)
        onSortChange?.(newSortBy, newSortDirection)
      },
      [sortBy, sortDirection, onSortChange],
    )

    const pairColumnDef = COLUMNS_DEFINITIONS.pair
    const volColumnDef = COLUMNS_DEFINITIONS.volume
    const lastPriceColumnDef = COLUMNS_DEFINITIONS.lastPrice
    const change24hColumnDef = COLUMNS_DEFINITIONS.change24h

    return (
      <div className='w-full flex items-center text-text-secondary text-xs h-8 px-4'>
        <SeparatorColumnWrapper className="flex-[5_1_0] truncate max-w-[70%] min-w-[122px] justify-start pr-[12px]">
          <SortableColumnHeader
            id={pairColumnDef.id}
            label={pairColumnDef.label}
            sortable={true}
            isCurrentlySorted={pairColumnDef.id === sortBy}
            currentSortDirection={
              pairColumnDef.id === sortBy ? sortDirection : null
            }
            onClick={handleColumnClick}
          />
          <SortableColumnHeader
            id={volColumnDef.id}
            label={volColumnDef.label}
            sortable={true}
            isCurrentlySorted={volColumnDef.id === sortBy}
            currentSortDirection={
              volColumnDef.id === sortBy ? sortDirection : null
            }
            onClick={handleColumnClick}
          />
        </SeparatorColumnWrapper>

        <SeparatorColumnWrapper className="flex-[3_1_0] truncate max-w-[70%] min-w-[calc(100%-122px)] justify-end sm:hidden pr-0">
          <SortableColumnHeader
            id={lastPriceColumnDef.id}
            label={lastPriceColumnDef.label}
            sortable={true}
            isCurrentlySorted={lastPriceColumnDef.id === sortBy}
            currentSortDirection={
              lastPriceColumnDef.id === sortBy ? sortDirection : null
            }
            onClick={handleColumnClick}
          />
          <SortableColumnHeader
            id={change24hColumnDef.id}
            label={change24hColumnDef.label}
            sortable={true}
            isCurrentlySorted={change24hColumnDef.id === sortBy}
            currentSortDirection={
              change24hColumnDef.id === sortBy ? sortDirection : null
            }
            onClick={handleColumnClick}
          />
        </SeparatorColumnWrapper>

        <OneColumnWrapper
          className="hidden sm:flex"
          key={lastPriceColumnDef.id}
        >
          <SortableColumnHeader
            id={lastPriceColumnDef.id}
            label={lastPriceColumnDef.label}
            sortable={true}
            isCurrentlySorted={lastPriceColumnDef.id === sortBy}
            currentSortDirection={
              lastPriceColumnDef.id === sortBy ? sortDirection : null
            }
            onClick={handleColumnClick}
          />
        </OneColumnWrapper>
        <OneColumnWrapper
          className="hidden sm:flex"
          key={change24hColumnDef.id}
        >
          <SortableColumnHeader
            id={change24hColumnDef.id}
            label={change24hColumnDef.label}
            sortable={true}
            isCurrentlySorted={change24hColumnDef.id === sortBy}
            currentSortDirection={
              change24hColumnDef.id === sortBy ? sortDirection : null
            }
            onClick={handleColumnClick}
          />
        </OneColumnWrapper>
      </div>
    )
  },
)

SortableTableHeader.displayName = 'SortableTableHeader'

export { SortableTableHeader }
