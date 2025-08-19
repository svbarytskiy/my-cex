import { FC, useState } from 'react'
import clsx from 'clsx'
import { Card } from 'common/ui/card'
import { Tabs } from 'common/ui/tabs'
import { useUrlTradePair } from 'common/hooks/useUrlTradePair'
import RangeSlider from 'features/trade-panel/ui/RangeSlider'

const TradePanel: FC = () => {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy')
  const [amount, setAmount] = useState('')
  const [price, setPrice] = useState('')
  const [total, setTotal] = useState('')
  const [activeOrderListTab, setActiveOrderListTab] = useState<
    'spot' | 'cross' | 'isolated' | 'grid'
  >('spot')
  const tradePair = useUrlTradePair()
  if (!tradePair) return null

  const { baseAsset, quoteAsset } = tradePair
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
    <>
      <Card className="w-full h-full relative border-t border-border-color">
        <Card.Header className=" px-4">
          <div className="flex justify-between items-center">
            <Tabs defaultActiveId={activeOrderListTab} className="">
              <Tabs.Header className="!border-b-0 w-full flex gap-5">
                <Tabs.Trigger
                  value="spot"
                  label="Spot"
                  onClick={() => setActiveOrderListTab('spot')}
                />
                <Tabs.Trigger
                  value="cross"
                  label="Cross"
                  onClick={() => setActiveOrderListTab('cross')}
                />
                <Tabs.Trigger
                  value="isolated"
                  label="Isolated"
                  onClick={() => setActiveOrderListTab('isolated')}
                />

                <Tabs.Trigger
                  value="grid"
                  label="Grid"
                  onClick={() => setActiveOrderListTab('grid')}
                />
              </Tabs.Header>
            </Tabs>
            <Card.Actions>
              <div className="" />
            </Card.Actions>
          </div>
        </Card.Header>
        <Card.Content className="p-3">
          <div className="w-full flex mb-4 p-1 bg-background-tertiary rounded gap-1">
            <button
              className={clsx(
                'flex-1 p-1 border-none text-text-secondary font-semibold cursor-pointer transition-all duration-200',
                'rounded',
                {
                  'text-white': activeTab === 'buy',
                  'bg-price-up': activeTab === 'buy',
                },
              )}
              onClick={() => setActiveTab('buy')}
            >
              Buy
            </button>
            <button
              className={clsx(
                'flex-1 p-1 border-none text-sm text-text-secondary font-semibold cursor-pointer transition-all duration-200',
                'rounded',
                {
                  'text-white': activeTab === 'sell',
                  'bg-price-down': activeTab === 'sell',
                },
              )}
              onClick={() => setActiveTab('sell')}
            >
              Sell
            </button>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] text-[var(--text-secondary)]">
                Price ({quoteAsset})
              </label>
              <input
                type="number"
                value={price}
                onChange={handlePriceChange}
                placeholder="0.00"
                className="bg-[var(--input-bg)] border border-[var(--border-color)] rounded p-2.5 text-[var(--text-primary)] text-sm outline-none focus:border-[var(--primary-color)]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] text-[var(--text-secondary)]">
                Amount ({baseAsset})
              </label>
              <input
                type="number"
                value={amount}
                onChange={handleAmountChange}
                placeholder="0.00"
                className=" border border-border-color rounded p-2.5 text-text-primary text-sm outline-none focus:border-text-primary"
              />
            </div>

            <RangeSlider />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-text-secondary">
                Total ({quoteAsset})
              </label>
              <input
                type="text"
                value={total}
                readOnly
                placeholder="0.00"
                className="border border-border-color rounded p-2.5 text-text-primary text-sm outline-none focus:border-text-primary"
              />
            </div>
            <button
              className={clsx(
                'w-full p-2 border-none rounded font-semibold text-sm cursor-pointer transition-colors duration-200 mt-2 text-text-primary',
                {
                  'bg-price-up': activeTab === 'buy',
                  'bg-price-down': activeTab === 'sell',
                },
              )}
            >
              {activeTab === 'buy' ? 'Buy BTC' : 'Sell BTC'}
            </button>
          </div>
          <div className="mt-4 border-t border-border-color pt-3">
            <div className="flex justify-between text-xs mb-1.5 text-text-secondary">
              <span>Available:</span>
              <span>0.00 {quoteAsset}</span>
            </div>
            <div className="flex justify-between text-xs text-text-secondary">
              <span>Balance:</span>
              <span>0.00 {baseAsset}</span>
            </div>
          </div>
        </Card.Content>
      </Card>
    </>
  )
}

export { TradePanel }

export default TradePanel
