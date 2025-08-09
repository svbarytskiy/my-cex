import { useMemo, useRef, useState, useEffect, FC } from 'react'
import OrderBookRow from '../OrderBookRow/OrderBookRow'
import { SpreadDisplay } from '../SpreadDisplay/SpreadDisplay'
import { Tooltip } from '../Tooltip/Tooltip'
import { useOrderBookHover } from '../../hooks/useOrderBookHover'
import { SPREAD_HEIGHT, ROW_HEIGHT } from 'features/order-book/constants'

interface DefaultOrderBookProps {
  bids: Array<{ price: string; quantity: string; total: string }>
  asks: Array<{ price: string; quantity: string; total: string }>
  price: string
  spread: { value: number; percentage: string }
  minQty: number
  quotePriceCount: number
  isMobile?: boolean
}
// put in conts

export const DefaultOrderBook: FC<DefaultOrderBookProps> = ({
  bids,
  asks,
  price,
  spread,
  minQty,
  quotePriceCount,
  isMobile,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const asksRef = useRef<HTMLDivElement>(null)
  const bidsRef = useRef<HTMLDivElement>(null)

  const { hoverInfo, handleRowHover, handleRowLeave, calculateAggregatedData } =
    useOrderBookHover(containerRef)

  const [itemsPerSection, setItemsPerSection] = useState(3)
  // make function
  useEffect(() => {
    const updateItemsCount = () => {
      if (!containerRef.current) return
      const availableHeight = containerRef.current.clientHeight - SPREAD_HEIGHT
      const items = Math.floor(availableHeight / (2 * ROW_HEIGHT))
      setItemsPerSection(Math.max(1, items))
    }

    updateItemsCount()
    const resizeObserver = new ResizeObserver(updateItemsCount)
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  const bidSlice = bids.slice(0, itemsPerSection)
  const asksSlice = asks.slice(0, itemsPerSection).reverse()

  const aggregatedData = useMemo(() => {
    const orders = hoverInfo?.type === 'ask' ? asksSlice : bidSlice
    return calculateAggregatedData(orders, hoverInfo)
  }, [hoverInfo, asksSlice, bidSlice, calculateAggregatedData])

  const maxQuantity = useMemo(() => {
    const allQuantityValues = [
      ...bidSlice.map(item => parseFloat(item.total)),
      ...asksSlice.map(item => parseFloat(item.total)),
    ]
    return allQuantityValues.length > 0 ? Math.max(...allQuantityValues) : 0
  }, [bidSlice, asksSlice])

  return (
    <div
      ref={containerRef}
      className="flex flex-col justify-around relative h-full w-full"
    >
      <div
        ref={asksRef}
        className="flex relative flex-col justify-center"
        style={{ height: `${itemsPerSection * ROW_HEIGHT}px` }}
      >
        <div className="flex flex-col overflow-y-auto">
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
              minQty={minQty}
              quotePriceCount={quotePriceCount}
            />
          ))}
        </div>
      </div>

      <SpreadDisplay
        quotePriceCount={quotePriceCount}
        price={price}
        spread={spread}
      />

      <div
        ref={bidsRef}
        className="flex flex-col justify-center"
        style={{ height: `${itemsPerSection * ROW_HEIGHT}px` }}
      >
        <div className="flex flex-col overflow-y-auto">
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
              minQty={minQty}
              quotePriceCount={quotePriceCount}
            />
          ))}
        </div>
      </div>

      {hoverInfo && !isMobile && (
        <>
          <div
            className="absolute top-0 left-0 w-full h-0 text-xs z-30 pointer-events-none outline outline-dashed  outline-gray-500"
            style={{ transform: `translateY(${hoverInfo.yOffset}px)` }}
          />
          <Tooltip
            targetElement={{ top: hoverInfo.yOffset, right: hoverInfo.xOffset }}
            data={aggregatedData}
            quotePriceCount={quotePriceCount}
          />
        </>
      )}
    </div>
  )
}
