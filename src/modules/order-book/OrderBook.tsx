import React, { useEffect, useMemo, useState } from 'react';
import './styles.css';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { fetchOrderBook, subscribeOrderBookWS, unsubscribeOrderBookWS } from '../../store/slices/orderBook/orderBookThunks';

interface OrderBookProps {
  symbol?: string;
}

const OrderBook: React.FC<OrderBookProps> = ({ symbol = 'BTCUSDT' }) => {
  const dispatch = useAppDispatch();
  const {
    bids,
    asks,
    loading,
    error,
    isInitialized,
    wsConnected
  } = useAppSelector(state => state.orderBook);

  const [precision, setPrecision] = useState<number>(0.1);

  // Ініціалізація ордербука
  useEffect(() => {
    dispatch(subscribeOrderBookWS(symbol));
    dispatch(fetchOrderBook({ symbol }));

    return () => {
      dispatch(unsubscribeOrderBookWS(symbol));
    };
  }, [dispatch, symbol]);

  // Групування та сортування даних
  const { groupedBids, groupedAsks, maxTotal, spread } = useMemo(() => {
    // Функція для групування по пресіжен
    const groupByPrecision = (orders: [string, string][], isBid = true) => {
      const grouped = new Map<number, any>();

      orders.forEach(([priceStr, sizeStr]) => {
        const price = parseFloat(priceStr);
        const size = parseFloat(sizeStr);
        const roundedPrice = Math.round(price / precision) * precision;

        if (grouped.has(roundedPrice)) {
          const existing = grouped.get(roundedPrice)!;
          grouped.set(roundedPrice, {
            price: roundedPrice,
            size: existing.size + size,
            total: existing.total + size
          });
        } else {
          grouped.set(roundedPrice, {
            price: roundedPrice,
            size,
            total: size
          });
        }
      });

      // Конвертуємо в масив і сортуємо
      const result = Array.from(grouped.values());
      result.sort((a, b) => isBid ? b.price - a.price : a.price - b.price);

      // Розраховуємо накопичений total
      let runningTotal = 0;
      return result.map(order => {
        runningTotal += order.size;
        return { ...order, total: runningTotal };
      });
    };

    const processedBids = groupByPrecision(bids, true);
    const processedAsks = groupByPrecision(asks, false);

    // Знаходимо максимальний total для відображення глибини
    const maxBidTotal = processedBids.length > 0 ? processedBids[processedBids.length - 1].total : 0;
    const maxAskTotal = processedAsks.length > 0 ? processedAsks[processedAsks.length - 1].total : 0;
    const maxTotal = Math.max(maxBidTotal, maxAskTotal);

    // Розраховуємо спред
    const bestBid = processedBids[0]?.price || 0;
    const bestAsk = processedAsks[0]?.price || 0;
    const spreadValue = bestAsk - bestBid;
    const spreadPercentage = (spreadValue / bestBid) * 100;

    return {
      groupedBids: processedBids,
      groupedAsks: processedAsks,
      maxTotal,
      spread: {
        value: spreadValue.toFixed(2),
        percentage: spreadPercentage.toFixed(2)
      }
    };
  }, [bids, asks, precision]);

  if (loading && !isInitialized) {
    return <div className="order-book loading">Loading order book...</div>;
  }

  if (error) {
    return <div className="order-book error">Error: {error}</div>;
  }

  return (
    <div className="order-book">
      <div className="order-book__header">
        <h3 className="order-book__title">Order Book - {symbol}</h3>
        <div className="order-book__status">
          {wsConnected ? '🟢 Connected' : '🔴 Disconnected'}
        </div>
        <div className="order-book__precision-controls">
          <button
            className={`order-book__precision-btn ${precision === 0.01 ? 'active' : ''}`}
            onClick={() => setPrecision(0.01)}
          >
            0.01
          </button>
          <button
            className={`order-book__precision-btn ${precision === 0.1 ? 'active' : ''}`}
            onClick={() => setPrecision(0.1)}
          >
            0.1
          </button>
          <button
            className={`order-book__precision-btn ${precision === 1 ? 'active' : ''}`}
            onClick={() => setPrecision(1)}
          >
            1
          </button>
        </div>
      </div>

      <div className="order-book__table">
        <div className="order-book__table-header">
          <div>Price (USDT)</div>
          <div>Size (BTC)</div>
          <div>Total</div>
        </div>

        <div className="order-book__table-body">
          {/* Asks - від найнижчої до найвищої ціни */}
          {groupedAsks.slice(0, 8).map((order, index) => (
            <div className="order-book__row ask" key={`ask-${order.price}`}>
              <div className="order-book__cell price ask">{order.price.toFixed(2)}</div>
              <div className="order-book__cell">{order.size.toFixed(4)}</div>
              <div className="order-book__cell">{order.total.toFixed(4)}</div>
              <div
                className="order-book__depth ask"
                style={{ width: `${(order.total / maxTotal) * 100}%` }}
              />
            </div>
          ))}

          {/* Спред */}
          <div className="order-book__spread">
            Spread: {spread.value} ({spread.percentage}%)
          </div>

          {/* Bids - від найвищої до найнижчої ціни */}
          {groupedBids.slice(0, 8).map((order, index) => (
            <div className="order-book__row bid" key={`bid-${order.price}`}>
              <div className="order-book__cell price bid">{order.price.toFixed(2)}</div>
              <div className="order-book__cell">{order.size.toFixed(4)}</div>
              <div className="order-book__cell">{order.total.toFixed(4)}</div>
              <div
                className="order-book__depth bid"
                style={{ width: `${(order.total / maxTotal) * 100}%` }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export { OrderBook };