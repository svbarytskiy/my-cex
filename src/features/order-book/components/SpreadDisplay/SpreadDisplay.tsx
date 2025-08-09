import React, { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { formatNumber } from 'common/utils/number'

interface SpreadData {
  value: number
  percentage: string
}

interface SpreadProps {
  price: string
  spread: SpreadData
  quotePriceCount: number
}

const SpreadDisplay: React.FC<SpreadProps> = ({
  price,
  spread,
  quotePriceCount,
}) => {
  const [direction, setDirection] = useState<'up' | 'down'>('up')
  const prevPriceRef = useRef<number | null>(null)

  useEffect(() => {
    const currentPrice = parseFloat(price)

    const prevPrice = prevPriceRef.current

    if (prevPrice !== null) {
      if (currentPrice >= prevPrice) setDirection('up')
      else if (currentPrice < prevPrice) setDirection('down')
    }

    prevPriceRef.current = currentPrice
  }, [price])

  const textColorClass = {
    up: 'text-price-up',
    down: 'text-price-down',
  }[direction]

  return (
    <div className="flex justify-between items-center text-sm px-3 py-2">
      <div
        className={clsx(
          'flex items-center gap-1 text-lg font-semibold',
          textColorClass,
        )}
      >
        {formatNumber(price, {
          minimumFractionDigits: quotePriceCount,
          maximumFractionDigits: quotePriceCount,
        })}
      </div>
      <div className="flex items-center gap-1 text-xs text-text-secondary">
        Spread:
        {formatNumber(spread.value, {
          minimumFractionDigits: quotePriceCount,
          maximumFractionDigits: quotePriceCount,
        })}
        ({spread.percentage}%)
      </div>
    </div>
  )
}

export { SpreadDisplay }
