import React, { useEffect } from 'react'
import {
  fetchInitialTrades,
  subscribeLastTradesWS,
  unsubscribeLastTradesWS,
} from '../../app/store/slices/lastTrades/lastTradesThunks'
import { useUrlTradePair } from 'common/hooks/useUrlTradePair'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorFallback } from 'common/components/ErrorFallback/ErrorFallback'
import { logError } from 'common/utils/logError'
import { TradeItem } from './ui/TardeItem'
import { Loader } from 'lucide-react'
import { getPrecisionFromMinPrice } from 'common/utils/getPrecisionFromMinPrice'

import { formatNumber } from 'common/utils/number'
import { formatLargeNumber } from 'common/utils/formatLargeNumber'
import {
  selectMinQtyBySymbol,
  selectTickSizeBySymbol,
} from 'app/store/slices/exchangeInfo/exchangeInfoSlice'
import { useAppDispatch, useAppSelector } from 'app/store/store'

export const LastTrades: React.FC = () => {
  const dispatch = useAppDispatch()
  const tradePair = useUrlTradePair()
  if (!tradePair) return null
  const { symbol, baseAsset, quoteAsset } = tradePair
  const { trades, loading, error } = useAppSelector(state => state.lastTrades)
  const minQty = useAppSelector(state => selectMinQtyBySymbol(state, symbol))!
  const tickSize = useAppSelector(state =>
    selectTickSizeBySymbol(state, symbol),
  )
  let basePriceCount = getPrecisionFromMinPrice(Number(minQty))
  let quotePriceCount = getPrecisionFromMinPrice(Number(tickSize))
  useEffect(() => {
    dispatch(fetchInitialTrades(symbol))
    dispatch(subscribeLastTradesWS({ symbol }))

    return () => {
      dispatch(unsubscribeLastTradesWS(symbol))
    }
  }, [dispatch, symbol])

  if (error) {
    return (
      <div className="h-142 md:h-75 lg:h-139 p-3 text-red-500">
        Error: {error}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="h-142 md:h-75 lg:h-139 flex items-center justify-around m-auto">
        <Loader />
      </div>
    )
  }
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onError={logError}>
      <div className="h-142 md:h-75 lg:h-139 flex flex-col text-xs font-inter bg-secondary w-full">
        <div className="flex flex-col">
          <div className="flex justify-between items-center px-3 py-1 font-medium text-xs text-text-secondary">
            <div className="flex w-full">
              <div className="flex-1 flex justify-start">
                Price ({quoteAsset})
              </div>
              <div className="flex-1 flex justify-end">
                Amount ({baseAsset})
              </div>
              <div className="flex-1 flex justify-end">Time</div>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-scroll scroll-smooth custom-scrollbar-hide">
          <div className="flex flex-col w-full">
            {trades.map(trade => (
              <TradeItem
                key={trade.id}
                price={formatNumber(parseFloat(trade.price), {
                  minimumFractionDigits: quotePriceCount,
                  maximumFractionDigits: quotePriceCount,
                })}
                qty={formatLargeNumber(trade.qty, {
                  minimumFractionDigits: basePriceCount,
                })}
                time={trade.time}
                isBuyerMaker={trade.isBuyerMaker}
              />
            ))}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}
