import { FC, memo, useState, useCallback, useMemo } from 'react'
import styles from './SortableTableHeader.module.css'
import { SortableColumnHeader } from '../SortableColumnHeader/SortableColumnHeader'
import { PairVolumeWrapper } from '../PairVolumeWrapper/PairVolumeWrapper'
import { OneColumnWrapper } from '../OneColumnWrapper/OneColumnWrapper'

export type SortDirection = 'asc' | 'desc' | null

export interface SortableColumn {
  id: string
  label: string
  sortable: boolean
}

interface SortableTableHeaderProps {
  initialSortBy: string | null
  initialSortDirection: SortDirection
  onSortChange?: (sortBy: string | null, sortDirection: SortDirection) => void
}

const SortableTableHeader: FC<SortableTableHeaderProps> = memo(
  ({  initialSortBy, initialSortDirection = null, onSortChange }) => {
    const columns: SortableColumn[] = useMemo(
      () => [
        {
          id: 'pair',
          label: 'Pair',
          sortable: true,
        },
        {
          id: 'volume',
          label: 'Vol',
          sortable: true,
        },
        {
          id: 'lastPrice',
          label: 'Last Price',
          sortable: true,
        },
        {
          id: 'change24h',
          label: '24h Change',
          sortable: true,
        },
      ],
      [],
    )
    const [sortBy, setSortBy] = useState<string | null>(initialSortBy)
    const [sortDirection, setSortDirection] =
      useState<SortDirection>(initialSortDirection)

    const handleColumnClick = useCallback(
      (columnId: string) => {
        const column = columns.find(col => col.id === columnId)
        if (!column || !column.sortable) {
          return
        }

        let newSortBy: string | null = columnId
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
      [sortBy, sortDirection, columns, onSortChange],
    )

    const pairColumnDef = columns.find(col => col.id === 'pair')
    const volColumnDef = columns.find(col => col.id === 'volume')

    return (
      <div className={styles.tableHeaderContainer}>
        <PairVolumeWrapper
          pairId={pairColumnDef?.id || 'pair'}
          pairLabel={pairColumnDef?.label || 'Pair'}
          isPairCurrentlySorted={pairColumnDef?.id === sortBy}
          pairSortDirection={
            pairColumnDef?.id === sortBy ? sortDirection : null
          }
          onPairClick={handleColumnClick}
          volId={volColumnDef?.id || 'volume'}
          volLabel={volColumnDef?.label || 'Vol'}
          isVolCurrentlySorted={volColumnDef?.id === sortBy}
          volSortDirection={volColumnDef?.id === sortBy ? sortDirection : null}
          onVolClick={handleColumnClick}
        />

        {columns
          .filter(col => col.id !== 'pair' && col.id !== 'volume')
          .map(column => (
            <OneColumnWrapper>
              <SortableColumnHeader
                key={column.id}
                id={column.id}
                label={column.label}
                sortable={column.sortable}
                isCurrentlySorted={column.id === sortBy}
                currentSortDirection={
                  column.id === sortBy ? sortDirection : null
                }
                onClick={handleColumnClick}
              />
            </OneColumnWrapper>
          ))}
      </div>
    )
  },
)

SortableTableHeader.displayName = 'SortableTableHeader'

export { SortableTableHeader }
