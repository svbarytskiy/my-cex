import './styles.css'
import { OrderBookViewSwitcher } from './components/OrderBookViewSwitcher/OrderBookViewSwitcher'
import { PriceAggregationSelector } from './components/PriceAggregationSelector/PriceAggregationSelector'
import { AsksOnlyOrderBook } from './components/AsksOnlyOrderBook/AsksOnlyOrderBook'
import { BidsOnlyOrderBook } from './components/BidsOnlyOrderBook/BidsOnlyOrderBook'
import { DefaultOrderBook } from './components/DefaultOrderBook/DefaultOrderBook'
import { useOrderBook } from './hooks/useOrderBook'
import OrderRatio from './components/OrderRatio/OrderRatio'
import { FC } from 'react'

interface OrderBookProps {
  symbol?: string
}

const OrderBook: FC<OrderBookProps> = ({ symbol = 'BTCUSDT' }) => {
  const {
    error,
    price,
    activeView,
    processedBids,
    processedAsks,
    spread,
    maxQuantity,
    buyPercentage,
    handleViewChange,
    handlePrecisionChange,
  } = useOrderBook(symbol)

  if (error) {
    return <div className="order-book error">Error: {error}</div>
  }

  return (
    <div className="order-book">
      <div className="order-book__header">
        <div className="order-book__precision-controls">
          <OrderBookViewSwitcher
            handleViewChange={handleViewChange}
            activeView={activeView}
          />
          <PriceAggregationSelector
            tickSize={0.01}
            onAggregationChange={handlePrecisionChange}
            currentPair={symbol}
          />
        </div>
      </div>
      <div className="order-book__table-header">
        <div>Price (USDT)</div>
        <div>Size (BTC)</div>
        <div>Total</div>
      </div>

      {activeView === 'default' && (
        <DefaultOrderBook
          bids={processedBids}
          asks={processedAsks}
          maxQuantity={maxQuantity}
          price={price}
          spread={spread}
        />
      )}

      {activeView === 'bidsOnly' && (
        <BidsOnlyOrderBook
          bids={processedBids}
          maxQuantity={maxQuantity}
          price={price}
          spread={spread}
        />
      )}

      {activeView === 'asksOnly' && (
        <AsksOnlyOrderBook
          asks={processedAsks}
          maxQuantity={maxQuantity}
          price={price}
          spread={spread}
        />
      )}

      <div className="order-book_footer">
        <OrderRatio buyPercent={+buyPercentage} />
      </div>
    </div>
  )
}

export { OrderBook }
