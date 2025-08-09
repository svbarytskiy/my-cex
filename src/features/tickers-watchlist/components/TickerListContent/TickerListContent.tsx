import { FC, useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { TradeListItem } from '../TradeListItem/TradeListItem'
import { NoDataScreen } from '../../ui/NoDataScreen/NoDataScreen'
import { AggregatedTradePair } from 'app/store/slices/miniTicker/miniTickerSelector'
import { Loader } from 'lucide-react'

interface TickerListContentProps {
  pairs: AggregatedTradePair[]
  loading: boolean
}

const TickerListContent: FC<TickerListContentProps> = ({ pairs, loading }) => {
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
      <div className="flex items-center justify-center w-full h-full min-h-[130px]">
        <Loader />
      </div>
    )
  }

  if (pairs.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <NoDataScreen message="No data." iconSize={80} color="#bbb" />
      </div>
    )
  }

  return (
    <div
      ref={parentRef}
      className="flex-1 overflow-y-auto box-border h-full [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-[#a1a1a1] [&::-webkit-scrollbar-thumb]:rounded-sm"
    >
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
              <TradeListItem data={item} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export { TickerListContent }
