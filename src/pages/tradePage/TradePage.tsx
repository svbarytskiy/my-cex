import { MarketInfo } from 'features/market-info'
import { MobileTradingLayout } from 'features/mobile-layout'
import { OrderList } from 'features/order-list'
import { TradePanel } from 'features/trade-panel'
import { TradingView } from 'features/trading-view'

const TradePage = () => {
  return (
    <>
      <div className="trading-page">
        <MarketInfo />
        <div className="trading-content-wrapper">
          <div className="trading-main">
            <div className="chart-area">
              <div className="chart-container">
                <TradingView />
              </div>

              <div className="order-book-container">
                <MobileTradingLayout />
              </div>
            </div>

            <div className="order-list-container">
              <OrderList />
            </div>
          </div>

          <div className="trading-sidebar">
            <TradePanel price="0.00" />
          </div>
        </div>
      </div>
    </>
  )
}
export { TradePage }
