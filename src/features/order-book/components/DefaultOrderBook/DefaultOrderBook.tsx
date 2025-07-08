import React, { useMemo, useRef } from 'react'
import OrderBookRow from '../OrderBookRow/OrderBookRow'
import { SpreadDisplay } from '../SpreadDisplay/SpreadDisplay'
import './DefaultOrderBook.css'
import { Tooltip } from '../Tooltip/Tooltip'
import { useOrderBookHover } from '../../hooks/useOrderBookHover'

interface DefaultOrderBookProps {
  bids: Array<{ price: string; quantity: string; total: string }>
  asks: Array<{ price: string; quantity: string; total: string }>
  maxQuantity: number
  price: string
  spread: { value: string; percentage: string }
}

export const DefaultOrderBook: React.FC<DefaultOrderBookProps> = ({
  bids,
  asks,
  maxQuantity,
  price,
  spread,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { hoverInfo, handleRowHover, handleRowLeave, calculateAggregatedData } =
    useOrderBookHover(containerRef)

  const bidSlice = bids.slice(0, 8)
  const asksSlice = asks.slice(0, 8).reverse()

  const aggregatedData = useMemo(() => {
    const orders = hoverInfo?.type === 'ask' ? asksSlice : bidSlice
    return calculateAggregatedData(orders, hoverInfo)
  }, [hoverInfo, asksSlice, bidSlice])

  return (
    <div
      style={{ position: 'relative' }}
      ref={containerRef}
      className="container"
    >
      <div className="">
        {asksSlice.map(({ price, quantity, total }, index) => (
          <OrderBookRow
            key={`ask-${price}-${quantity}`}
            price={price}
            quantity={quantity}
            total={total}
            isHovered={
              !!(
                hoverInfo &&
                hoverInfo.index <= index &&
                hoverInfo.type === 'ask'
              )
            }
            type="ask"
            index={index}
            maxQuantity={maxQuantity}
            onHover={handleRowHover}
            onLeave={handleRowLeave}
          />
        ))}
      </div>

      <SpreadDisplay price={price} spread={spread} />

      {bidSlice.map(({ price, quantity, total }, index) => (
        <OrderBookRow
          key={`bid-${price}-${quantity}`}
          price={price}
          quantity={quantity}
          total={total}
          isHovered={
            !!(
              hoverInfo &&
              hoverInfo.index >= index &&
              hoverInfo.type === 'bid'
            )
          }
          type="bid"
          index={index}
          maxQuantity={maxQuantity}
          onHover={handleRowHover}
          onLeave={handleRowLeave}
        />
      ))}

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
