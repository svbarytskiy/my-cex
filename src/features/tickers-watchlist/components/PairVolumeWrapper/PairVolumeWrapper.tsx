import { FC, memo } from 'react'
import styles from './PairVolumeWrapper.module.css'
import { SortableColumnHeader } from '../SortableColumnHeader/SortableColumnHeader'
import { SortDirection } from '../SortableTableHeader/SortableTableHeader' // Імпортуємо типи

interface PairVolumeWrapperProps {
  pairId: string
  pairLabel: string
  isPairCurrentlySorted: boolean
  pairSortDirection: SortDirection
  onPairClick: (columnId: string) => void
  volId: string
  volLabel: string
  isVolCurrentlySorted: boolean
  volSortDirection: SortDirection
  onVolClick: (columnId: string) => void
  flexBasis?: string
  justifyContent?: 'flex-start' | 'flex-end' | 'center'
}

const PairVolumeWrapper: FC<PairVolumeWrapperProps> = memo(
  ({
    pairId,
    pairLabel,
    isPairCurrentlySorted,
    pairSortDirection,
    onPairClick,
    volId,
    volLabel,
    isVolCurrentlySorted,
    volSortDirection,
    onVolClick
  }) => {
    return (
      <div
        className={styles.pairVolumeGroup}
      >
        <SortableColumnHeader
          id={pairId}
          label={pairLabel}
          sortable={true}
          isCurrentlySorted={isPairCurrentlySorted}
          currentSortDirection={pairSortDirection}
          onClick={onPairClick}
        />
        <div className={styles.separator}>/</div>
        <SortableColumnHeader
          id={volId}
          label={volLabel}
          sortable={true}
          isCurrentlySorted={isVolCurrentlySorted}
          currentSortDirection={volSortDirection}
          onClick={onVolClick}
        />
      </div>
    )
  },
)

PairVolumeWrapper.displayName = 'PairVolumeWrapper'

export { PairVolumeWrapper }
