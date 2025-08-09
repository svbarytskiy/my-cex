import { FC, memo } from 'react'
import { formatNumber } from 'common/utils/number'
import { formatPercent } from 'common/utils/format'
import { StatItem } from '../StatItem/StatItem'
import clsx from 'clsx'
import { formatLargeNumber } from 'common/utils/formatLargeNumber'

interface MarketInfoStatsProps {
  baseAsset: string
  quoteAsset: string
  percentChange: string
  quoteChange: string
  high: string
  low: string
  volume: string
  quoteVolume: string
}

const MarketInfoStats: FC<MarketInfoStatsProps> = memo(
  ({
    baseAsset,
    quoteAsset,
    percentChange,
    quoteChange,
    high,
    low,
    volume,
    quoteVolume,
  }) => {
    const isPositiveChange = percentChange.includes('-')

    return (
      <div
        className="
        grid grid-cols-[1fr_1fr] grid-rows-[auto_auto] gap-4 
        [grid-template-areas:'A_B'_'C_D']                    
        md:flex md:flex-row md:gap-x-2 md:gap-y-0         
        md:items-center md:justify-center
      "
      >
        <StatItem
          className="hidden md:flex"
          label="24h change"
          value={
            <span
              className={clsx(
                'flex text-xs font-medium rounded-md items-center',
                isPositiveChange ? 'text-price-down' : 'text-price-up',
              )}
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
        <StatItem
          label="24h High"
          value={formatNumber(high)}
          className="[grid-area:A]"
        />
        <StatItem
          label="24h Low"
          value={formatNumber(low)}
          className="[grid-area:C]"
        />
        <StatItem
          className="hidden md:flex "
          label={`24h Volume(${baseAsset})`}
          value={formatNumber(volume, { maximumFractionDigits: 2 })}
        />
        <StatItem
          className="flex md:hidden [grid-area:B]"
          label={`24h Vol(${baseAsset})`}
          value={formatLargeNumber(volume)}
        />
        <StatItem
          className="hidden md:flex"
          label={`24h Turnover(${quoteAsset})`}
          value={formatNumber(quoteVolume, { maximumFractionDigits: 2 })}
        />
        <StatItem
          className="flex md:hidden [grid-area:D]"
          label={`24h Vol(${quoteAsset})`}
          value={formatLargeNumber(quoteVolume)}
        />
      </div>
    )
  },
)

MarketInfoStats.displayName = 'MarketInfoStats'

export { MarketInfoStats }
