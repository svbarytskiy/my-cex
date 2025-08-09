import { AggregatedData } from 'features/order-book/types'
import { FC } from 'react'
import { formatLargeNumber } from 'common/utils/formatLargeNumber'
import { formatNumber } from 'common/utils/number'

interface TooltipProps {
  targetElement: {
    top: number
    right: number
  }
  data: AggregatedData | null
  quotePriceCount: number
}

export const Tooltip: FC<TooltipProps> = ({
  targetElement,
  data,
  quotePriceCount,
}) => {
  if (!targetElement) return null
  if (!data) return null

  return (
    <div
      className={`absolute top-0 bg-text-primary text-background-tertiary rounded-lg p-2 shadow-md z-50 h-18 w-45 text-xs mr-2`}
      style={{
        transform: `translateY(${targetElement.top - 36}px)`,
        right: `calc(100% + 5px)`,
        zIndex: 100,
      }}
    >
      <div className="absolute right-[-8px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-text-primary after:content-['']" />

      <div className="flex justify-between mb-1">
        <span className="text-background-tertiary mr-3">Avg Price:</span>
        <span className="text-background-tertiary">
          {formatNumber(data.avgPrice, {
            minimumFractionDigits: quotePriceCount,
            maximumFractionDigits: quotePriceCount,
          })}
        </span>
      </div>

      <div className="flex justify-between mb-1">
        <span className="text-background-tertiary mr-3">Base Volume:</span>
        <span className="text-background-tertiary">
          {formatLargeNumber(data.total)}
        </span>
      </div>

      <div className="flex justify-between">
        <span className="text-background-tertiary mr-3">Quote Volume:</span>
        <span className="text-background-tertiary">
          {formatLargeNumber(data.quoteSum)}
        </span>
      </div>
    </div>
  )
}
