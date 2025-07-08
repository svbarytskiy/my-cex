import React, { useMemo, useRef } from 'react'
import OrderBookRow from '../OrderBookRow/OrderBookRow'
import { SpreadDisplay } from '../SpreadDisplay/SpreadDisplay'
import './AsksOnlyOrderBook.css' // Імпортуємо стилі
import { useOrderBookHover } from '../../hooks/useOrderBookHover'
import { Tooltip } from '../Tooltip/Tooltip'

interface AsksOnlyOrderBookProps {
  asks: Array<{ price: string; quantity: string; total: string }>
  maxQuantity: number
  price: string
  spread: { value: string; percentage: string }
}

export const AsksOnlyOrderBook: React.FC<AsksOnlyOrderBookProps> = ({
  asks,
  maxQuantity,
  price,
  spread,
}) => {
  const asksSlice = asks.slice(0, 30)
  const containerRef = useRef<HTMLDivElement>(null)

  const { hoverInfo, handleRowHover, handleRowLeave, calculateAggregatedData } =
    useOrderBookHover(containerRef)
  const aggregatedData = useMemo(() => {
    return calculateAggregatedData(asksSlice, hoverInfo)
  }, [hoverInfo, asksSlice])
  return (
    <div className="asks-container" ref={containerRef}>
      <div className="ask-wrapper">
        <div className="asks-list ">
          {asksSlice.map(({ price, quantity, total }, index) => (
            <OrderBookRow
              key={`ask-${price}-${quantity}`}
              price={price}
              quantity={quantity}
              total={total}
              type="ask"
              maxQuantity={maxQuantity}
              index={index}
              onHover={handleRowHover}
              onLeave={handleRowLeave}
              isHovered={!!(hoverInfo && hoverInfo.index >= index)}
            />
          ))}
        </div>
      </div>
      <div className="spread-display-container">
        <SpreadDisplay price={price} spread={spread} />
      </div>
      {hoverInfo && (
        <>
          <div
            className="position-div"
            style={{ transform: `translateY(${hoverInfo.yOffset}px)` }}
          />
          <Tooltip
            targetElement={{ top: hoverInfo.yOffset, right: hoverInfo.xOffset }}
            data={aggregatedData}
          />
        </>
      )}
    </div>
  )
}
