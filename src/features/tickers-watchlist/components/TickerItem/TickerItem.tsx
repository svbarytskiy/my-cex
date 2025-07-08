import styles from './TickerItem.module.css'
import { FC } from 'react'

interface TickerItemProps {
  symbol: string
  price: number
  change: number
  volume?: number
  isFavorite?: boolean
}

const TickerItem: FC<TickerItemProps> = ({
  symbol,
  price,
  change,
  volume,
  isFavorite,
}) => {
  return (
    <div className={styles.tickerItem}>
      <span className={styles.tickerSymbol}>{symbol}</span>
      <span className={styles.tickerPrice}>{price}</span>
      <span className={styles.tickerChange}>{change}</span>
    </div>
  )
}

export { TickerItem }
