import { FC } from "react"

interface TradeItemProps {
  price: string
  qty: string
  time: number
  isBuyerMaker: boolean
}
export const TradeItem: FC<TradeItemProps> = ({
  price,
  qty,
  time,
  isBuyerMaker,
}) => {
  const tradePriceClass = isBuyerMaker ? 'text-price-down' : 'text-price-up'

  return (
    <div
      className="w-full h-5 items-center
          flex p-1.5 px-3 relative overflow-hidden
           cursor-pointer text-text-primary text-xs"
    >
      <span className={`flex-1 flex justify-start ${tradePriceClass}`}>
        {price}
      </span>
      <span className="flex-1 flex justify-end">{qty}</span>
      <span className="flex-1 flex justify-end">
        {new Date(time).toLocaleTimeString()}
      </span>
    </div>
  )
}
