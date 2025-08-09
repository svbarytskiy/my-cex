import { FC, useMemo, useRef } from 'react'
import OrderBookRow from '../OrderBookRow/OrderBookRow'
import { SpreadDisplay } from '../SpreadDisplay/SpreadDisplay'
import { useOrderBookHover } from '../../hooks/useOrderBookHover'
import { Tooltip } from '../Tooltip/Tooltip'

interface AsksOnlyOrderBookProps {
  asks: Array<{ price: string; quantity: string; total: string }>
  price: string
  spread: { value: number; percentage: string }
  minQty: number
  quotePriceCount: number
  isMobile?: boolean
}

export const AsksOnlyOrderBook: FC<AsksOnlyOrderBookProps> = ({
  asks,
  price,
  spread,
  minQty,
  quotePriceCount,
  isMobile,
}) => {
  const asksSlice = asks.slice(0, 40).reverse()
  const containerRef = useRef<HTMLDivElement>(null)

  const { hoverInfo, handleRowHover, handleRowLeave, calculateAggregatedData } =
    useOrderBookHover(containerRef)
  const aggregatedData = useMemo(() => {
    return calculateAggregatedData(asksSlice, hoverInfo)
  }, [hoverInfo, asksSlice])

  const maxQuantity = Math.max(
    ...asksSlice.map(({ total }) => parseFloat(total)),
  )

  return (
    <div
      className="relative flex flex-col md:h-59 lg:h-123 w-full"
      ref={containerRef}
    >
      <div className="flex flex-1 flex-col-reverse relative overflow-y-auto will-change-transform ltr custom-scrollbar-hide">
        <div className="flex flex-col">
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
              isHovered={
                !!(
                  hoverInfo &&
                  hoverInfo.index <= index &&
                  hoverInfo.type === 'ask'
                )
              }
              minQty={minQty}
              quotePriceCount={quotePriceCount}
            />
          ))}
        </div>
      </div>
      <div className="">
        <SpreadDisplay
          price={price}
          spread={spread}
          quotePriceCount={quotePriceCount}
        />
      </div>
      {hoverInfo && !isMobile && (
        <>
          <div
            className="absolute top-0 left-0 w-full h-0 text-transparent z-30 pointer-events-none outline outline-dashed outline-gray-500"
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
