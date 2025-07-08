// TradePanel.tsx
import './styles.css'
import { FC, useState } from 'react'

interface TradePanelProps {
  price: string
}

const TradePanel: FC<TradePanelProps> = () => {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy')
  const [amount, setAmount] = useState('')
  const [price, setPrice] = useState('')
  const [total, setTotal] = useState('')

  const calculateTotal = (amount: string, price: string) => {
    if (amount && price) {
      const result = parseFloat(amount) * parseFloat(price)
      setTotal(result.toFixed(2))
    } else {
      setTotal('')
    }
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setAmount(value)
    calculateTotal(value, price)
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPrice(value)
    calculateTotal(amount, value)
  }

  return (
    <div className="trade-panel">
      <div className="trade-panel__tabs">
        <button
          className={`trade-panel__tab ${activeTab === 'buy' ? 'active buy' : ''}`}
          onClick={() => setActiveTab('buy')}
        >
          Buy
        </button>
        <button
          className={`trade-panel__tab ${activeTab === 'sell' ? 'active sell' : ''}`}
          onClick={() => setActiveTab('sell')}
        >
          Sell
        </button>
      </div>

      <div className="trade-panel__form">
        <div className="trade-panel__input-group">
          <label>Price (USDT)</label>
          <input
            type="number"
            value={price}
            onChange={handlePriceChange}
            placeholder="0.00"
          />
        </div>

        <div className="trade-panel__input-group">
          <label>Amount (BTC)</label>
          <input
            type="number"
            value={amount}
            onChange={handleAmountChange}
            placeholder="0.00"
          />
        </div>

        <div className="trade-panel__input-group">
          <label>Total (USDT)</label>
          <input type="text" value={total} readOnly placeholder="0.00" />
        </div>

        <div className="trade-panel__slider">
          <div className="trade-panel__slider-labels">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
          <input type="range" min="0" max="100" step="25" />
        </div>

        <button className={`trade-panel__submit ${activeTab}`}>
          {activeTab === 'buy' ? 'Buy BTC' : 'Sell BTC'}
        </button>
      </div>

      <div className="trade-panel__balance">
        <div className="trade-panel__balance-item">
          <span>Available:</span>
          <span>0.00 USDT</span>
        </div>
        <div className="trade-panel__balance-item">
          <span>Balance:</span>
          <span>0.00 USDT</span>
        </div>
      </div>
    </div>
  )
}

export { TradePanel }
