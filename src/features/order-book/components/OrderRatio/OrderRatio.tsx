import { FC } from "react"

interface OrderRatioProps {
  buyPercent: number
  sellPercent?: number
}

export const OrderRatio: FC<OrderRatioProps> = ({
  buyPercent,
  sellPercent = 100 - buyPercent,
}) => {
  const validatedBuy = Math.min(100, Math.max(0, buyPercent))
  const finalSellPercent = sellPercent

  const buyLabel = 'B'
  const sellLabel = 'S'
  const buyColorClass = 'text-price-up'
  const sellColorClass = 'text-price-down'
  const buyBorderColorClass = 'border-price-up'
  const sellBorderColorClass = 'border-price-down'
  const buyBgClass = 'bg-price-up/10'
  const sellBgClass = 'bg-price-down/10'

  return (
    <div className="flex w-full h-6 relative rounded-md box-border">
      <div
        className={`flex items-center relative h-full overflow-hidden ${buyBgClass}`}
        style={
          {
            width: `${validatedBuy}%`,
            minWidth: '80px',
            clipPath: 'polygon(0 0, 100% 0, calc(100% - 6px) 100%, 0% 100%)',
          } as React.CSSProperties
        }
      >
        <div className="flex items-center justify-center gap-1.5 whitespace-nowrap text-xs font-medium">
          <span
            className={`box-border w-6 h-6 border-2 rounded flex items-center justify-center ${buyBorderColorClass} ${buyColorClass}`}
          >
            {buyLabel}
          </span>
          <span className={buyColorClass}>{validatedBuy.toFixed(2)}%</span>
        </div>
      </div>

      <div
        className={`flex items-center justify-end relative h-full overflow-hidden ${sellBgClass}`}
        style={
          {
            width: `${finalSellPercent}%`,
            minWidth: '80px',
            clipPath: 'polygon(6px 0, 100% 0, 100% 100%, 0% 100%)',
          } as React.CSSProperties
        }
      >
        <div className="flex items-center justify-center gap-1.5 whitespace-nowrap text-xs font-medium">
          <span className={sellColorClass}>{finalSellPercent.toFixed(2)}%</span>
          <span
            className={`box-border w-6 h-6 border-2 rounded flex items-center justify-center ${sellBorderColorClass} ${sellColorClass}`}
          >
            {sellLabel}
          </span>
        </div>
      </div>
    </div>
  )
}
