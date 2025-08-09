import { FC, memo } from 'react'
import { Link } from 'react-router-dom'
import { FavoriteStar } from 'common/components/FavoriteStar/FavoriteStar'
import { formatNumber } from 'common/utils/number'
import { AggregatedTradePair } from 'app/store/slices/miniTicker/miniTickerSelector'
import { formatLargeNumber } from 'common/utils/formatLargeNumber'
import { getPrecisionFromMinPrice } from 'common/utils/getPrecisionFromMinPrice'

interface TradeListItemProps {
  data: AggregatedTradePair
}

const TradeListItem: FC<TradeListItemProps> = memo(({ data }) => {
  if (!data) return null
  const {
    symbol,
    baseAsset,
    quoteAsset,
    volume,
    currentPrice,
    priceChange24h,
    priceTickSize,
    isFavorite,
  } = data

  const lastPrice = currentPrice
  const change24h = priceChange24h
  const changeColorClass =
    change24h >= 0 ? 'text-price-up' : change24h < 0 ? 'text-price-down' : ''

  const formatPrice = formatNumber(lastPrice, {
    minimumFractionDigits: getPrecisionFromMinPrice(Number(priceTickSize)),
  })

  return (
    <div
      className="relative left-0 top-0 h-[45px] w-full box-border px-4 py-0
                   hover:bg-background-tertiary-hover"
    >
      <div className="w-full h-full">
        <Link
          to={`/trade/${baseAsset + '_' + quoteAsset}`}
          className="flex items-center sm:items-start w-full h-full no-underline text-inherit overflow-hidden"
        >
          <div
            className="flex-grow-[5] flex-shrink-1 basis-0 min-w-[120px] justify-start
                       flex-nowrap pt-[4px] flex items-start"
          >
            <div className="pt-[3px] flex items-center justify-center">
              <FavoriteStar
                isActive={isFavorite}
                onClick={() => {}}
                hasBorder={false}
                className="text-text-secondary hover:text-text-secondary hover:opacity-100"
              />
            </div>
            <div className="ml-1 flex flex-col">
              <div className="flex items-center leading-[22px] whitespace-nowrap text-ellipsis">
                <span className="text-[14px] text-text-primary select-none">
                  {symbol}
                </span>
              </div>
              <div
                className="leading-4 text-text-secondary whitespace-nowrap overflow-hidden text-ellipsis
                           text-[12px]"
              >
                Vol {formatLargeNumber(volume)}
              </div>
            </div>
          </div>

          <div
            className="flex-grow-[5] flex-shrink-1 basis-0 min-w-[120px] flex flex-col items-end justify-center pr-0 ml-auto
                       sm:min-w-[60px] sm:flex-nowrap sm:pt-[5px] sm:flex-row sm:items-start sm:justify-end sm:ml-0 sm:pr-0"
          >
            <div className="text-text-primary text-[14px] text-right w-full">
              {formatPrice}
            </div>
            <div
              className={`block text-[12px] ${changeColorClass}
                         sm:hidden`}
            >
              {change24h > 0 ? '+' : ''}
              {change24h.toFixed(2)}%
            </div>
          </div>

          <div
            className={`hidden
                        sm:flex-grow-[5] sm:flex-shrink-1 sm:basis-0 sm:min-w-[60px] sm:justify-end
                        sm:flex-nowrap sm:pt-[5px] sm:flex sm:items-start sm:overflow-hidden sm:text-ellipsis sm:whitespace-nowrap
                        ${changeColorClass}`}
          >
            <div className="text-inherit text-[14px] text-right w-full">
              {change24h > 0 ? '+' : ''}
              {change24h.toFixed(2)}%
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
})

TradeListItem.displayName = 'TradeListItem'

export { TradeListItem }
