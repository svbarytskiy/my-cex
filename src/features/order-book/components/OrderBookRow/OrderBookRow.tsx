import { memo, useRef } from 'react'
import { formatLargeNumber } from 'common/utils/formatLargeNumber'
import { formatNumber } from 'common/utils/number'

interface OrderBookRowProps {
  price: string
  quantity: string
  total: string
  maxQuantity: number
  type: 'bid' | 'ask'
  index: number
  onHover: (
    price: string,
    type: 'bid' | 'ask',
    rect: HTMLElement,
    index: number,
  ) => void
  onLeave: () => void
  isHovered: boolean
  minQty: number
  quotePriceCount: number
}

const OrderBookRow = memo<OrderBookRowProps>(
  ({
    price,
    quantity,
    total,
    type,
    maxQuantity,
    onHover,
    onLeave,
    index,
    isHovered,
    minQty,
    quotePriceCount,
  }) => {
    const ref = useRef<HTMLDivElement>(null)
    const handleEnter = () => {
      if (ref.current) onHover(price, type, ref.current, index)
    }
    const fillPercent = (parseFloat(total) / maxQuantity) * 100
    const priceColorClass = type === 'bid' ? 'text-price-up' : 'text-price-down'
    const fillColorClass =
      type === 'bid' ? 'bg-price-up/10' : 'bg-price-down/10'

    return (
      <div
        className={`w-full h-5 items-center
          flex p-1.5 px-3 relative overflow-hidden
           cursor-pointer text-text-primary text-xs
          ${isHovered ? 'md:bg-gray-700/40' : ''}
        `}
        key={`${type}-${price}`}
        ref={ref}
        onMouseEnter={handleEnter}
        onMouseLeave={onLeave}
      >
        <div
          className={`
            absolute right-0 top-0 bottom-0 z-0 pointer-events-none 
            transition-all duration-200 ease-in-out ${fillColorClass}
          `}
          style={{ width: `${fillPercent}%` }}
        />

        <div className={`z-10 ${priceColorClass} flex-1 flex justify-start`}>
          {formatNumber(parseFloat(price), {
            minimumFractionDigits: quotePriceCount,
            maximumFractionDigits: quotePriceCount,
          })}
        </div>

        <div className="z-10 flex-1 flex justify-end">
          {formatLargeNumber(quantity, { minimumFractionDigits: minQty })}
        </div>

        <div className="z-10 flex-1 flex justify-end">
          {formatLargeNumber(total, { minimumFractionDigits: minQty })}
        </div>
      </div>
    )
  },
)

export default OrderBookRow
