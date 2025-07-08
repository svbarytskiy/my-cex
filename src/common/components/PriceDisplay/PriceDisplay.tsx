import { FC, memo, useEffect, useRef, useState } from 'react'
import styles from './PriceDisplay.module.css'
import { formatNumber } from 'utils/number'
import { formatCurrency } from 'utils/currency'

interface PriceDisplayProps {
  price: string
}

const PriceDisplay: FC<PriceDisplayProps> = memo(({ price }) => {
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
  const getColor = () => {
    switch (direction) {
      case 'up':
        return '#0ecb81'
      case 'down':
        return '#ff4d4f'
      default:
        return '#ffff'
    }
  }

  return (
    <div style={{ color: getColor() }} className={styles.priceContainer}>
      <span className={styles.mainPrice}>{formatNumber(price)}</span>
      <span className={styles.usdPrice}>{formatCurrency(price, 'USD')}</span>
    </div>
  )
})

PriceDisplay.displayName = 'PriceDisplay'

export { PriceDisplay }
