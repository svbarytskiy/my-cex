import { FC, memo, useEffect, useMemo, useRef, useState } from 'react'
import { formatNumber } from 'common/utils/number'
import { formatCurrency } from 'common/utils/currency'
import { formatPercent } from 'common/utils/format'

interface PriceDisplayProps {
  price: string
  percentChange: string
}

const PriceDisplay: FC<PriceDisplayProps> = memo(({ price, percentChange }) => {
  const [direction, setDirection] = useState<'up' | 'down' | 'neutral'>(
    'neutral',
  )
  const prevPriceRef = useRef<number | null>(null)

  useEffect(() => {
    const currentPrice = parseFloat(price)

    const prevPrice = prevPriceRef.current

    if (prevPrice !== null) {
      if (currentPrice > prevPrice) setDirection('up')
      else if (currentPrice < prevPrice) setDirection('down')
      else setDirection('neutral')
    }

    prevPriceRef.current = currentPrice
  }, [price])

  const textColorClass = {
    up: 'text-price-up',
    down: 'text-price-down',
    neutral: 'text-white',
  }[direction]

  const percentChangeColorClass = useMemo(() => {
    const change = parseFloat(percentChange)
    if (change >= 0) return 'text-price-up'
    if (change < 0) return 'text-price-down'
  }, [percentChange])

  return (
    <div
      className={`flex flex-col text-[20px] font-semibold box-border ${textColorClass}`}
    >
      <span className="box-border">{formatNumber(price)}</span>
      <div className="flex items-center font-normal">
        <div className="text-text-primary text-xs">
          {formatCurrency(price, 'USD')}
        </div>
        <div className={`md:hidden text-xs ml-1 ${percentChangeColorClass}`}>
          {formatPercent(percentChange)}
        </div>
      </div>
    </div>
  )
})

PriceDisplay.displayName = 'PriceDisplay'

export { PriceDisplay }
