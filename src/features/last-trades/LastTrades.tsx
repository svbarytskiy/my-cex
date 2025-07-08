import React, { useEffect } from 'react'
import {
  fetchInitialTrades,
  subscribeLastTradesWS,
  unsubscribeLastTradesWS,
} from '../../store/slices/lastTrades/lastTradesThunks'
import { useAppDispatch, useAppSelector } from '../../store/store'
import './styles.css'

const formatPrice = (value: number, decimals: number = 2): string => {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}
const formatQuantity = (
  qty: number,
  totalWidth: number = 10,
  decimals: number = 4,
): string => {
  const fixed = qty.toFixed(decimals)
  const [intPart, decPart] = fixed.split('.')
  const paddedInt = intPart.padStart(totalWidth - decimals - 1, '0')
  return `${paddedInt}.${decPart}`
}

const LastTrades: React.FC = () => {
  const dispatch = useAppDispatch()
  const { trades, loading, error } = useAppSelector(state => state.lastTrades)
  const symbol = 'BTCUSDT'

  useEffect(() => {
    dispatch(fetchInitialTrades(symbol))
    dispatch(subscribeLastTradesWS({ symbol }))

    return () => {
      dispatch(unsubscribeLastTradesWS(symbol))
    }
  }, [dispatch, symbol])

  if (loading) return <div>Loading trades...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="trades-container">
      <div className="trades-list">
        <div className="trades-header">
          <span className="header-price">Price (USDT)</span>
          <span className="header-quantity">Size (BTC)</span>
          <span className="header-time">Time</span>
        </div>
        {trades.map(trade => (
          <div key={trade.id} className="trade-item">
            <span
              className={`trade-price ${trade.isBuyerMaker ? 'sell' : 'buy'}`}
            >
              {formatPrice(Number(trade.price), 2)}
            </span>
            <span className="trade-quantity">
              {formatQuantity(Number(trade.qty), 1, 5)}
            </span>
            <span className="trade-time">
              {new Date(trade.time).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LastTrades
