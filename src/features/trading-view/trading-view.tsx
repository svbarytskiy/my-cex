import { FC, useEffect, useState } from 'react'
import { CandleStickChart } from './components/CandleStickChart/CandleStickChart'
import { ChartHeader } from './components/ChartHeader/ChartHeader'
import {
  clearEntry,
  selectCandlesEntry,
  selectError,
  selectLoading,
  selectStreamingData,
} from 'app/store/slices/candles/candlesSlice'
import {
  fetchCandles,
  subscribeWS,
  unsubscribeWS,
} from '../../app/store/slices/candles/candlesThunks'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorFallback } from 'common/components/ErrorFallback/ErrorFallback'
import { logError } from 'common/utils/logError'
import { useUrlTradePair } from 'common/hooks/useUrlTradePair'
import { Loader } from 'lucide-react'
import { KlineInterval } from 'app/store/slices/candles/types'
import { useAppDispatch, useAppSelector } from 'app/store/store'

const TradingView: FC = () => {
  const dispatch = useAppDispatch()
  const [view, setView] = useState<'standard' | 'tradingview' | 'depth'>(
    'tradingview',
  )
  const [activeInterval, setActiveInterval] = useState<KlineInterval>('1m')

  const tradePair = useUrlTradePair()
  if (!tradePair) return null
  const { symbol } = tradePair
  const key = `${symbol}_${activeInterval}`

  const changeInterval = (interval: KlineInterval) => {
    if (activeInterval !== interval) {
      setActiveInterval(interval)
    }
  }

  const candlesEntry = useAppSelector(state => selectCandlesEntry(state, key))
  const loading = useAppSelector(selectLoading)
  const error = useAppSelector(selectError)
  const streamingData = useAppSelector(state => selectStreamingData(state, key))
  useEffect(() => {
    const key = `${symbol}_${activeInterval}`
    dispatch(fetchCandles({ symbol, interval: activeInterval }))
    dispatch(subscribeWS({ symbol, interval: activeInterval }))

    return () => {
      dispatch(clearEntry(key))
      dispatch(unsubscribeWS({ symbol, interval: activeInterval }))
    }
  }, [symbol, activeInterval])

  const candles = candlesEntry?.candles || []

  return (
    <div className="w-full h-139 md:h-100 lg:h-139 flex flex-col relative">
      <ErrorBoundary FallbackComponent={ErrorFallback} onError={logError}>
        <ChartHeader
          activeView={view}
          onViewChange={newView => setView(newView)}
          activeInterval={activeInterval}
          onIntervalChange={changeInterval}
        />
        <div className="flex-1 justify-center items-center flex">
          {loading && <Loader />}
          {error && <div className="text-red-500">Error: {error}</div>}
          {!loading && !error && candles.length > 0 && (
            <CandleStickChart candles={candles} streamingData={streamingData} />
          )}
        </div>
      </ErrorBoundary>
    </div>
  )
}

export { TradingView }
