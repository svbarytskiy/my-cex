import { FC, useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorFallback } from 'common/components/ErrorFallback/ErrorFallback'
import { logError } from 'common/utils/logError'
import { useUrlTradePair } from 'common/hooks/useUrlTradePair'
import { OrderBookViewSwitcher } from './components/OrderBookViewSwitcher/OrderBookViewSwitcher'
import { PriceAggregationSelector } from './components/PriceAggregationSelector/PriceAggregationSelector'
import { AsksOnlyOrderBook } from './components/AsksOnlyOrderBook/AsksOnlyOrderBook'
import { BidsOnlyOrderBook } from './components/BidsOnlyOrderBook/BidsOnlyOrderBook'
import { DefaultOrderBook } from './components/DefaultOrderBook/DefaultOrderBook'
import { OrderRatio } from './components/OrderRatio/OrderRatio'
import {
  selectIsOrderRatioVisible,
  selectTotalColumnCurrency,
  selectTotalColumnType,
} from './order-book.slice'
import { useOrderBookSettings } from './hooks/useOrderBookSettings'
import { resetDepthState, setSymbol } from 'app/store/slices/depth/depthSlice'
import {
  subscribeDepthWS,
  fetchDepth,
  unsubscribeDepthWS,
} from 'app/store/slices/depth/depthThunks'
import { useOrderBookState } from './hooks/useOrderBookState'
import { useProcessedOrderData } from './hooks/useOrderBookProcessedData'
import { Loader } from 'lucide-react'
import { getPrecisionFromMinPrice } from 'common/utils/getPrecisionFromMinPrice'
import { useDeviceType } from 'common/hooks/useDeviceType'
import { selectMinQtyBySymbol } from 'app/store/slices/exchangeInfo/exchangeInfoSlice'
import { fetchExchangeInfo } from 'app/store/slices/exchangeInfo/exchangeInfoThunks'
import { useAppDispatch, useAppSelector } from 'app/store/store'

const OrderBook: FC = () => {
  const tradePair = useUrlTradePair()
  if (!tradePair) return null

  const { symbol, baseAsset, quoteAsset } = tradePair
  const dispatch = useAppDispatch()
  const totalColumnCurrency = useAppSelector(selectTotalColumnCurrency)
  const totalColumnType = useAppSelector(selectTotalColumnType)
  const isOrderRatioVisible = useAppSelector(selectIsOrderRatioVisible)
  const { loading, error, rawBids, rawAsks, price } = useOrderBookState()
  useEffect(() => {
    dispatch(fetchExchangeInfo())
    dispatch(resetDepthState())
    dispatch(setSymbol(symbol))
    dispatch(subscribeDepthWS(symbol))
    dispatch(fetchDepth({ symbol }))
    return () => {
      dispatch(unsubscribeDepthWS(symbol))
    }
  }, [dispatch, symbol])

  const {
    activeView,
    precision,
    tickSize,
    handleViewChange,
    handlePrecisionChange,
  } = useOrderBookSettings(symbol)
  const { buyPercentage, processedBids, processedAsks, spread } =
    useProcessedOrderData(
      rawBids,
      rawAsks,
      precision,
      totalColumnType,
      totalColumnCurrency,
      Number(price),
    )

  const minQty = useAppSelector(state => selectMinQtyBySymbol(state, symbol))!
  const basePriceCount = getPrecisionFromMinPrice(Number(minQty))
  const quotePriceCount = getPrecisionFromMinPrice(Number(tickSize))
  const { isMobile } = useDeviceType()
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
    <div className="h-142 md:h-75 lg:h-139 flex flex-col text-xs font-inter bg-secondary">
      <ErrorBoundary FallbackComponent={ErrorFallback} onError={logError}>
        <div className="px-3 py-2 flex justify-between items-center">
          <div className="w-full flex items-center justify-between">
            <OrderBookViewSwitcher
              handleViewChange={handleViewChange}
              activeView={activeView}
            />
            <PriceAggregationSelector
              tickSize={tickSize}
              onAggregationChange={handlePrecisionChange}
              price={price}
              precision={precision}
            />
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex justify-between items-center px-3 py-1 font-medium text-xs text-text-secondary">
            <div className="flex w-full">
              <div className="flex-1 flex justify-start">
                Price ({quoteAsset})
              </div>
              <div className="flex-1 flex justify-end">
                Amount ({baseAsset})
              </div>
              <div className="flex-1 flex justify-end">
                Total ({totalColumnCurrency === 'base' ? baseAsset : quoteAsset}
                )
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-1 w-full">
          {activeView === 'default' && (
            <DefaultOrderBook
              bids={processedBids}
              asks={processedAsks}
              price={price}
              spread={spread}
              minQty={basePriceCount}
              quotePriceCount={quotePriceCount}
              isMobile={isMobile}
            />
          )}

          {activeView === 'bidsOnly' && (
            <BidsOnlyOrderBook
              bids={processedBids}
              price={price}
              spread={spread}
              minQty={basePriceCount}
              quotePriceCount={quotePriceCount}
              isMobile={isMobile}
            />
          )}

          {activeView === 'asksOnly' && (
            <AsksOnlyOrderBook
              asks={processedAsks}
              price={price}
              spread={spread}
              minQty={basePriceCount}
              quotePriceCount={quotePriceCount}
              isMobile={isMobile}
            />
          )}
        </div>
        {isOrderRatioVisible && activeView == 'default' && (
          <div className="p-3 flex items-center ">
            <OrderRatio buyPercent={+buyPercentage} />
          </div>
        )}
      </ErrorBoundary>
    </div>
  )
}

export { OrderBook }
