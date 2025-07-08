import React, { useRef } from 'react'
import './styles.css'

interface OrderBookRowProps {
  price: string
  quantity: string
  total?: string
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
}

const OrderBookRow = React.memo<OrderBookRowProps>(
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
  }) => {
    const ref = useRef<HTMLDivElement>(null)
    const handleEnter = () => {
      if (ref.current) onHover(price, type, ref.current, index)
    }
    const qty = parseFloat(quantity)
    const fillPercent = Math.min(100, (qty / maxQuantity) * 100)
    const formatPrice = (value: string | number): string => {
      const num = typeof value === 'string' ? parseFloat(value) : value
      if (isNaN(num)) return '0.00'
      return num.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    }

    const backgroundColor =
      type === 'bid' ? 'rgba(37, 167, 80, 0.2)' : 'rgba(202, 63, 100, 0.2)'
    return (
      <div
        className={`order-book__row ${type} ${isHovered ? 'order-book__row__hovered' : ''}`}
        key={`${type}-${price}`}
        ref={ref}
        onMouseEnter={handleEnter}
        onMouseLeave={onLeave}
      >
        <div
          className="order-book__fill"
          style={{
            width: `${fillPercent}%`,
            backgroundColor,
          }}
        />
        <div className={`order-book__cell price ${type}`}>
          {formatPrice(parseFloat(price).toFixed(2))}
        </div>
        <div className="order-book__cell">
          {parseFloat(quantity).toFixed(4)}
        </div>
        <div className="order-book__cell">
          {total ? parseFloat(total).toFixed(6) : ''}
        </div>
        <div
          className={`order-book__cell ${type}`}
          style={{ width: `${100}%` }}
        />
      </div>
    )
  },
)

export default OrderBookRow
