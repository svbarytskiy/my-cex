import './App.css';
import { Layout } from './common/components/layout/Layout';
import { MarketInfo } from './modules/market-info/MarketInfo';
import { TradePanel } from './modules/trade-panel/TradePanel';
import { OrderList } from './modules/order-list/OrderList';
import { TradingView } from './modules/trading-view/TradingView';
import { MobileTradingLayout } from './modules/mobile-layout/MobileLayout';


function App() {
  return (
    <Layout>
      <div className="trading-page">
        {/* Ліва частина: Графік + Ордербук */}
        <div className="trading-main">
          <MarketInfo />
          
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

        {/* Права частина: Торгова панель */}
        <div className="trading-sidebar">
          <TradePanel />
        </div>
      </div>
    </Layout>
  );
}

export default App;