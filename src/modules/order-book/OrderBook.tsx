import React, { useEffect, useMemo, useState } from 'react';
import './styles.css';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { fetchOrderBook, subscribeOrderBookWS, unsubscribeOrderBookWS } from '../../store/slices/orderBook/orderBookThunks';
import { createSelector } from '@reduxjs/toolkit';
import OrderBookRow from './components/OrderBookRow/OrderBookRow';
import OrderRatio from './components/OrderRatio/OrderRatio';
import SpreadDisplay from './components/SpreadDisplay/SpreadDisplay';
import { OrderBookViewSwitcher } from './components/OrderBookViewSwitcher/OrderBookViewSwitcher';
import { PriceAggregationSelector } from './components/PriceAggregationSelector/PriceAggregationSelector';
import { fetchExchangeInfo } from '../../store/slices/exchangeInfo/exchangeInfoThunks';

interface OrderBookProps {
  symbol?: string;
}
const selectOrderBook = (state: any) => state.orderBook;

const selectOrderBookData = createSelector(
  [selectOrderBook],
  (orderBook) => {
    const sortedBids = [...orderBook.bidsArray].sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]));
    const sortedAsks = [...orderBook.asksArray].sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]));

    return {
      bids: sortedBids.slice(0, 8),
      asks: sortedAsks.slice(0, 8),
      spread: calculateSpread(sortedBids, sortedAsks),
    };
  }
);

const calculateSpread = (bids: any, asks: any) => {
  const bestBid = bids[0]?.[0] || 0;
  const bestAsk = asks[0]?.[0] || 0;
  return {
    value: (bestAsk - bestBid).toFixed(2),
    percentage: ((bestAsk - bestBid) / bestBid * 100).toFixed(2)
  };
};

const OrderBook: React.FC<OrderBookProps> = ({ symbol = 'BTCUSDT' }) => {
  const price = useAppSelector((state: any) => state.ticker.price);
  const dispatch = useAppDispatch();
  const {
    loading,
    error,
    wsConnected
  } = useAppSelector(state => state.orderBook);


  const [precision, setPrecision] = useState<number>(0.01);
  const data = useAppSelector((state) => state.exchangeInfo.data);
  const symbolInfo = data?.symbols?.find(s => s.symbol === symbol);
  const tickSize = symbolInfo?.filters?.find(f => f.filterType === 'PRICE_FILTER')?.tickSize;
  const { bids, asks, spread } = useAppSelector(selectOrderBookData);

  const processedBids = useMemo(() => {
    let runningTotal = 0;
    return bids.map(([price, quantity]) => {
      runningTotal += parseFloat(quantity);
      console.log('Running total:', [price, quantity], runningTotal);
      return {
        price,
        quantity,
        total: runningTotal.toFixed(6)
      };
    });
  }, [bids]);

  const processedAsks = useMemo(() => {
    let runningTotal = 0;
    return asks.map(([price, quantity]) => {
      runningTotal += parseFloat(quantity);
      return {
        price,
        quantity,
        total: runningTotal.toFixed(6)
      };
    });
  }, [asks]);

  const displayedAsks = useMemo(() => {
    return [...processedAsks].reverse();
  }, [processedAsks]);

  useEffect(() => {
    dispatch(fetchExchangeInfo(symbol));
    dispatch(subscribeOrderBookWS(symbol));
    dispatch(fetchOrderBook({ symbol }));

    return () => {
      dispatch(unsubscribeOrderBookWS(symbol));
    };
  }, [dispatch, symbol]);

  const totalBidVolume = bids.reduce((acc, [_, quantity]) => acc + parseFloat(quantity), 0);
  const totalAskVolume = asks.reduce((acc, [_, quantity]) => acc + parseFloat(quantity), 0);

  const totalVolume = totalBidVolume + totalAskVolume;

  const buyPercentage = ((totalBidVolume / totalVolume) * 100).toFixed(1);

  const maxQuantity = useMemo(() => {
    const maxBid = Math.max(...bids.map(([, quantity]) => parseFloat(quantity)));
    const maxAsk = Math.max(...asks.map(([, quantity]) => parseFloat(quantity)));
    return Math.max(maxBid, maxAsk);
  }, [bids, asks]);
  if (error) {
    return <div className="order-book error">Error: {error}</div>;
  }

  return (
    <div className="order-book">
      <div className="order-book__header">
        <div className="order-book__precision-controls">
          <OrderBookViewSwitcher />
          <PriceAggregationSelector tickSize={0.01} onAggregationChange={(precision) => setPrecision(precision)} currentPair={symbol} />
        </div>
      </div>

      <div className="order-book__table">
        <div className="order-book__table-header">
          <div>Price (USDT)</div>
          <div>Size (BTC)</div>
          <div>Total</div>
        </div>

        <div className="order-book__table-body">
          {displayedAsks.map(({ price, quantity, total }) => (
            <OrderBookRow
              key={`ask-${price}-${quantity}`}
              price={price}
              quantity={quantity}
              total={total}
              type="ask"
              maxQuantity={maxQuantity}
            />
          ))}

          <SpreadDisplay price={price} spread={spread} />

          {processedBids.map(({ price, quantity, total }) => (
            <OrderBookRow
              key={`bid-${price}-${quantity}`}
              price={price}
              quantity={quantity}
              total={total}
              type="bid"
              maxQuantity={maxQuantity}
            />
          ))}
        </div>
      </div>
      <div className="order-book_footer">
        <OrderRatio buyPercent={+buyPercentage} />
      </div>
    </div>
  );
};

export { OrderBook };