import { useEffect, FC } from 'react'
import styles from './MarketInfo.module.css'
import { useAppDispatch, useAppSelector } from 'store/store'
import { subscribeTickerkWS } from 'store/slices/ticker/tickerThunks'
import { MarketInfoStats } from './components/MarketInfoStats/MarketInfoStats'
import { MarketInfoHeader } from './components/MarketInfoHeader/MarketInfoHeader'

const MarketInfo: FC = () => {
  const dispatch = useAppDispatch()
  const symbol = 'BTCUSDT'
  useEffect(() => {
    dispatch(subscribeTickerkWS(symbol))
  }, [])
  const { price, high, low, percentChange, volume, quoteVolume, quoteChange } =
    useAppSelector(state => state.ticker)

  return (
    <div className={styles.marketInfoContainer}>
      <div className={styles.marketInfo}>
        <MarketInfoHeader
          symbol={symbol}
          price={price}
          onFavoriteClick={() => {}}
          isFavorite={false}
        />
        <MarketInfoStats
          percentChange={percentChange}
          quoteChange={quoteChange}
          high={high}
          low={low}
          volume={volume}
          quoteVolume={quoteVolume}
        />
      </div>
    </div>
  )
}

export { MarketInfo }
