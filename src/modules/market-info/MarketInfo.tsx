import React, { useState, useEffect } from 'react';
import './styles.css'; // Припускаємо, що тут є загальні стилі
import { useAppDispatch, useAppSelector } from '../../store/store';
import { subscribeTickerkWS } from '../../store/slices/ticker/tickerThunks';

interface CryptoItem {
  symbol: string;
  name: string;
  logo?: string;
}

interface MarketInfoProps { }

interface CurrentPair {
  symbol: string;
  price: string;
  change24h: string;
  high24h: string;
  low24h: string;
  volume24h: string;
  logo?: string;
}

const MarketInfo: React.FC<MarketInfoProps> = () => {
  const dispatch = useAppDispatch()
  const [cryptoList, setCryptoList] = useState<CryptoItem[]>([]);
  const [currentPair, setCurrentPair] = useState<CurrentPair>({
    symbol: 'BTC/USDT',
    price: '63,245.80',
    change24h: '+2.34%',
    high24h: '63,800.20',
    low24h: '62,100.50',
    volume24h: '1.24B',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/640px-Bitcoin.svg.png',
  });
  const symbol = 'BTCUSDT'
  useEffect(() => {
    // const mockCryptoData: CryptoItem[] = [
    //   { symbol: 'BTC/USDT', name: 'Bitcoin / Tether', logo: 'btc.png' },
    //   { symbol: 'ETH/USDT', name: 'Ethereum / Tether', logo: 'eth.png' },
    //   { symbol: 'BNB/USDT', name: 'Binance Coin / Tether', logo: 'bnb.png' },
    //   { symbol: 'XRP/USDT', name: 'Ripple / Tether', logo: 'xrp.png' },
    //   { symbol: 'ADA/USDT', name: 'Cardano / Tether', logo: 'ada.png' },
    // ];
    // setCryptoList(mockCryptoData);
    dispatch(subscribeTickerkWS(symbol))
  }, []);
  const {
    price,
    high,
    low,
    percentChange,
    volume,
    quoteVolume,
  } = useAppSelector(state => state.ticker);


  const formatPercent = (percent: string | number): string => {
    const num = typeof percent === 'string' ? parseFloat(percent) : percent;
    if (isNaN(num)) return '0.00%';
    const sign = num >= 0 ? '+' : '';
    return `${sign}${num.toFixed(2)}%`;
  };

  const formatPrice = (value: string | number): string => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return '0.00';
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatVolume = (value: string | number): string => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return '0.00';

    if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(2)}B`;
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(2)}K`;

    return num.toFixed(2);
  };


  return (
    <div className="market-info-container">
      <div className="market-info">
        <div className="market-info__header">
          <div className="market-info__pairlogo">
            {currentPair.logo && <img src={currentPair.logo} alt={`${currentPair.symbol} logo`} />}
          </div>
          <h2 className="market-info__pair">{currentPair.symbol}</h2>
          <span className="market-info__price">{formatPrice(price)}</span>
          <span className={`market-info__change ${percentChange.includes('+') ? 'positive' : 'negative'}`}>
            {formatPercent(percentChange)}
          </span>
        </div>

        <div className="market-info__stats">
          <div className="market-info__stat">
            <span className="stat-label">24h High</span>
            <span className="stat-value">{formatPrice(high)}</span>
          </div>
          <div className="market-info__stat">
            <span className="stat-label">24h Low</span>
            <span className="stat-value">{formatPrice(low)}</span>
          </div>
          <div className="market-info__stat">
            <span className="stat-label">24h Volume (BTC)</span>
            <span className="stat-value">{formatVolume(volume)}</span>
          </div>
          <div className="market-info__stat">
            <span className="stat-label">24h Volume (USDT)</span>
            <span className="stat-value">{formatVolume(quoteVolume)}</span>
          </div>
        </div>

        <div className="market-info__favorites">
          {/* <button className="favorite-btn active">★</button> */}
          <button className="favorite-btn">☆</button>
        </div>
      </div>
    </div>
  );
};

export { MarketInfo };