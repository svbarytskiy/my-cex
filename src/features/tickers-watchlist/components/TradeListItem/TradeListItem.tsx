import { FC, memo } from 'react'
import { Link } from 'react-router-dom'
import styles from './TradeListItem.module.css'
import { FavoriteStar } from 'common/components/FavoriteStar/FavoriteStar'
import { formatNumber } from 'utils/number'
import { AggregatedTradePair } from 'store/slices/miniTicker/miniTickerSelector'

interface TradeListItemProps {
  data: AggregatedTradePair
  onToggleFavorite: (symbol: string, isFavorite: boolean) => void
}

const TradeListItem: FC<TradeListItemProps> = memo(
  ({ data, onToggleFavorite }) => {
    if (!data) return null
    const { symbol, volume, currentPrice, priceChange24h, priceTickSize } = data

    const isFavorite = false
    const lastPrice = currentPrice
    const change24h = priceChange24h

    const changeColorClass =
      change24h >= 0
        ? styles.itemColorBuy
        : change24h < 0
          ? styles.itemColorSell
          : ''

    const formatVolume = (vol: number) => {
      if (vol >= 1_000_000_000) return (vol / 1_000_000_000).toFixed(2) + 'B'
      if (vol >= 1_000_000) return (vol / 1_000_000).toFixed(2) + 'M'
      if (vol >= 1_000) return (vol / 1_000).toFixed(2) + 'K'
      return vol.toLocaleString()
    }

    const getPrecisionFromMinPrice = (minPrice: number): number => {
      const s = minPrice.toString()
      if (s.includes('e-')) {
        return parseInt(s.split('e-')[1], 10)
      }
      if (s.includes('.')) {
        return s.split('.')[1].length
      }
      return 0
    }

    const formatPrice = formatNumber(lastPrice, {
      minimumFractionDigits: getPrecisionFromMinPrice(Number(priceTickSize)),
    })
    return (
      <div className={styles.listItemContainer}>
        <div className={styles.tradeMarketColumnWrap}>
          <Link className={styles.contentLink} to={`/trade/${symbol}`}>
            <div className={styles.itemSymbolColumn}>
              <div className={styles.favoriteWrapper}>
                <FavoriteStar
                  isActive={isFavorite}
                  onClick={e => {
                    e.preventDefault()
                    e.stopPropagation()
                    onToggleFavorite(symbol, !isFavorite)
                  }}
                  hasBorder={false}
                />
              </div>
              <div className={styles.itemSymbolContainer}>
                <div className={styles.itemSymbolText}>
                  <span className={styles.symbolText}>{symbol}</span>
                  {/* <span className={styles.baseAssetText}>
                    /{displayBaseAsset}
                  </span> */}
                  {/* Якщо у вас MiniTicker не містить leverage, ця частина буде пуста */}
                  {/* {leverage && (
                    <span className={styles.marketMultiple}>{leverage}</span>
                  )} */}
                </div>
                <div className={styles.volumeText}>
                  Vol {formatVolume(volume)}
                </div>
              </div>
            </div>

            <div className={styles.itemLastPriceColumn}>
              <div className={styles.lastPriceText}>{formatPrice}</div>
            </div>

            <div className={`${styles.itemChangeColumn} ${changeColorClass}`}>
              <div className={styles.changeText}>
                {change24h > 0 ? '+' : ''}
                {change24h.toFixed(2)}%
              </div>
            </div>
          </Link>
        </div>
      </div>
    )
  },
)

TradeListItem.displayName = 'TradeListItem'

export { TradeListItem }
