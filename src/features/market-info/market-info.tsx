import { useEffect, FC } from 'react'

import { MarketInfoStats } from './components/MarketInfoStats/MarketInfoStats'
import { MarketInfoHeader } from './components/MarketInfoHeader/MarketInfoHeader'
import { useUrlTradePair } from 'common/hooks/useUrlTradePair'
import { Loader } from 'lucide-react'
import { ErrorFallback } from 'common/components/ErrorFallback/ErrorFallback'
import { ErrorBoundary } from 'react-error-boundary'
import { logError } from 'common/utils/logError'
import {
  subscribeTickerkWS,
  unsubscribeTickerWS,
} from 'app/store/slices/ticker/tickerThunks'
import { useAppDispatch, useAppSelector } from 'app/store/store'

const MarketInfo: FC = () => {
  const dispatch = useAppDispatch()
  const tradePair = useUrlTradePair()

  if (!tradePair) return null

  const { symbol, baseAsset, quoteAsset } = tradePair

  useEffect(() => {
    if (symbol && baseAsset && quoteAsset) {
      dispatch(subscribeTickerkWS(symbol))
    }
    return () => {
      dispatch(unsubscribeTickerWS(symbol))
    }
  }, [dispatch, symbol, baseAsset, quoteAsset])
  const {
    price,
    high,
    low,
    percentChange,
    volume,
    quoteVolume,
    quoteChange,
    wsConnected,
  } = useAppSelector(state => state.ticker)
  if (!wsConnected)
    return (
      <div className="w-full bg-background-secondary h-15 flex items-center justify-center">
        <Loader />
      </div>
    )

  return (
    <div className="relative bg-background-secondary border-t border-border-color py-2 px-3 md:py-[5px] md:px-4 flex flex-col md:flex-row gap-2">
      <ErrorBoundary FallbackComponent={ErrorFallback} onError={logError}>
        <div className="flex gap-5 md:flex-row md:justify-start justify-between w-full">
          <MarketInfoHeader
            symbol={symbol}
            baseAsset={baseAsset}
            quoteAsset={quoteAsset}
            price={price}
            percentChange={percentChange}
          />
          <MarketInfoStats
            baseAsset={baseAsset}
            quoteAsset={quoteAsset}
            percentChange={percentChange}
            quoteChange={quoteChange}
            high={high}
            low={low}
            volume={volume}
            quoteVolume={quoteVolume}
          />
        </div>
      </ErrorBoundary>
    </div>
  )
}

MarketInfo.displayName = 'MarketInfo'

export { MarketInfo }
