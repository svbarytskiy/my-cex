import { FC, useMemo, useRef } from 'react'
import { SpreadDisplay } from '../SpreadDisplay/SpreadDisplay'
import OrderBookRow from '../OrderBookRow/OrderBookRow'
import { useOrderBookHover } from '../../hooks/useOrderBookHover'
import { Tooltip } from '../Tooltip/Tooltip'

interface BidsOnlyOrderBookProps {
  bids: Array<{ price: string; quantity: string; total: string }>
  price: string
  spread: { value: number; percentage: string }
  minQty: number
  quotePriceCount: number
  isMobile?: boolean
}

export const BidsOnlyOrderBook: FC<BidsOnlyOrderBookProps> = ({
  price,
  spread,
  bids,
  minQty,
  quotePriceCount,
  isMobile
}) => {
  const bidsSlice = bids.slice(0, 40)
  const containerRef = useRef<HTMLDivElement>(null)
  const { hoverInfo, handleRowHover, handleRowLeave, calculateAggregatedData } =
    useOrderBookHover(containerRef)
  const aggregatedData = useMemo(() => {
    return calculateAggregatedData(bidsSlice, hoverInfo)
  }, [hoverInfo, bidsSlice])
  const maxQuantity = Math.max(
    ...bidsSlice.map(({ total }) => parseFloat(total)),
  )
  //4 father comp
  return (
    <div
      className="relative flex flex-col md:h-59 lg:h-123 w-full"
      ref={containerRef}
    >
      <div className="">
        <SpreadDisplay
          price={price}
          spread={spread}
          quotePriceCount={quotePriceCount}
        />
      </div>

      <div className="flex-1 overflow-y-auto will-change-transform custom-scrollbar-hide">
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
            minQty={minQty}
            quotePriceCount={quotePriceCount}
          />
        ))}
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
