// components/MarketInfo/components/MarketInfoStats/MarketInfoStats.tsx
import { FC, memo } from 'react'
import styles from './MarketInfoStats.module.css'
import { formatNumber } from 'utils/number'
import { formatPercent } from 'utils/format'
import { StatItem } from '../StatItem/StatItem'

interface MarketInfoStatsProps {
  percentChange: string
  quoteChange: string
  high: string
  low: string
  volume: string
  quoteVolume: string
}

const MarketInfoStats: FC<MarketInfoStatsProps> = memo(
  ({ percentChange, quoteChange, high, low, volume, quoteVolume }) => {
    const isPositiveChange = percentChange.includes('-')

    return (
      <div className={styles.statsContainer}>
        <StatItem
          label="24h change"
          value={
            <span
              className={`${styles.changeValue} ${isPositiveChange ? styles.negative : styles.positive}`}
            >
              <div style={{ direction: 'ltr' }}>
                {formatNumber(quoteChange)}
              </div>
              <div style={{ marginLeft: '4px' }}>
                {formatPercent(percentChange)}
              </div>
            </span>
          }
        />
        <StatItem label="24h high" value={formatNumber(high)} />
        <StatItem label="24h low" value={formatNumber(low)} />
        <StatItem
          label="24h volume (BTC)"
          value={formatNumber(volume, { maximumFractionDigits: 2 })}
        />
        <StatItem
          label="24h turnover (USDT)"
          value={formatNumber(quoteVolume, { maximumFractionDigits: 2 })}
        />
      </div>
    )
  },
)

MarketInfoStats.displayName = 'MarketInfoStats'

export { MarketInfoStats }
