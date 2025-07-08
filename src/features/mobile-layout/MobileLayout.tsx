import { Tabs } from '../../common/components/Tabs/Tabs'
import LastTrades from '../last-trades/LastTrades'
import { OrderBook } from '../order-book/OrderBook'
import styles from './MobileTradingLayout.module.css'

export const MobileTradingLayout = () => {
  const tabs = [
    {
      id: 'orderbook',
      label: 'Книга ордерів',
      content: <OrderBook />,
    },
    {
      id: 'trades',
      label: 'Останні угоди',
      content: <LastTrades />,
    },
  ]

  return (
    <div className={styles.container}>
      <Tabs tabs={tabs} defaultActiveId="orderbook" />
    </div>
  )
}
