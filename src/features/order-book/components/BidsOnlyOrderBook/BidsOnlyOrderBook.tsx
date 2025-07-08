import React, { useMemo, useRef } from 'react'
import { SpreadDisplay } from '../SpreadDisplay/SpreadDisplay'
import OrderBookRow from '../OrderBookRow/OrderBookRow'
import './BidsOnlyOrderBook.css' // Імпортуємо стилі
import { useOrderBookHover } from '../../hooks/useOrderBookHover'
import { Tooltip } from '../Tooltip/Tooltip'

interface BidsOnlyOrderBookProps {
  bids: Array<{ price: string; quantity: string; total: string }>
  maxQuantity: number
  price: string
  spread: { value: string; percentage: string }
}

export const BidsOnlyOrderBook: React.FC<BidsOnlyOrderBookProps> = ({
  price,
  spread,
  bids,
  maxQuantity,
}) => {
  const bidsSlice = bids.slice(0, 30).reverse()
  const containerRef = useRef<HTMLDivElement>(null)
  const { hoverInfo, handleRowHover, handleRowLeave, calculateAggregatedData } =
    useOrderBookHover(containerRef)
  const aggregatedData = useMemo(() => {
    return calculateAggregatedData(bidsSlice, hoverInfo)
  }, [hoverInfo, bidsSlice])
  // const maxQuantityBids = Math.max(
  //   ...bidsSlice.map(({ quantity }) => parseFloat(quantity)),
  // )

  return (
    <div className="bids-container" ref={containerRef}>
      <div className="spread-display-container">
        <SpreadDisplay price={price} spread={spread} />
      </div>

      <div className="bids-list">
        {bidsSlice.map(({ price, quantity, total }, index) => (
          <OrderBookRow
            key={`bid-${price}-${quantity}`}
            price={price}
            quantity={quantity}
            total={total}
            type="bid"
            maxQuantity={maxQuantity}
            index={index}
            onHover={handleRowHover}
            onLeave={handleRowLeave}
            isHovered={!!(hoverInfo && hoverInfo.index >= index)}
          />
        ))}
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
