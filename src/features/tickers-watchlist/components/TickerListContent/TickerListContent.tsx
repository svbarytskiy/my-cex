import { FC, useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { TradeListItem } from '../TradeListItem/TradeListItem'
import { Loader } from 'common/components/Loader/Loader'
import { NoDataScreen } from '../NoDataScreen/NoDataScreen'
import { AggregatedTradePair } from 'store/slices/miniTicker/miniTickerSelector'
import styles from './TickerListContent.module.css'

interface TickerListContentProps {
  pairs: AggregatedTradePair[]
  loading: boolean
  onItemToggleFavorite?: (item: AggregatedTradePair) => void
}

const TickerListContent: FC<TickerListContentProps> = ({
  pairs,
  loading,
  onItemToggleFavorite,
}) => {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: pairs.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 45,
    overscan: 5,
  })

  const virtualItems = virtualizer.getVirtualItems()

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader color="#f0b90b" />
      </div>
    )
  }

  if (pairs.length === 0) {
    return (
      <div className={styles.noDataContainer}>
        <NoDataScreen message="No data." iconSize={80} color="#bbb" />
      </div>
    )
  }

  return (
    <div ref={parentRef} className={styles.listContainer}>
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: 'relative',
        }}
      >
        {virtualItems.map(virtualItem => {
          const item = pairs[virtualItem.index]
          if (!item) return null

          return (
            <div
              key={virtualItem.key}
              data-index={virtualItem.index}
              ref={virtualizer.measureElement}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <TradeListItem data={item} onToggleFavorite={() => {}} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export { TickerListContent }
