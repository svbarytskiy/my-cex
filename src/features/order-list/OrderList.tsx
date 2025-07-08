import './styles.css'

const OrderList = () => {
  // Тестові дані
  const orders = [
    {
      id: 1,
      pair: 'BTC/USDT',
      type: 'Buy',
      price: 63420.5,
      amount: 0.125,
      filled: 0.125,
      total: 7927.56,
      status: 'Filled',
    },
    {
      id: 2,
      pair: 'BTC/USDT',
      type: 'Sell',
      price: 63500.0,
      amount: 0.2,
      filled: 0.1,
      total: 12700.0,
      status: 'Partial',
    },
    {
      id: 3,
      pair: 'BTC/USDT',
      type: 'Buy',
      price: 63350.0,
      amount: 0.3,
      filled: 0.0,
      total: 19005.0,
      status: 'Pending',
    },
  ]

  return (
    <div className="order-list">
      <div className="order-list__header">
        <h3>Orders</h3>
        <div className="order-list__tabs">
          <button className="active">Open</button>
          <button>History</button>
        </div>
      </div>

      <div className="order-list__table">
        <div className="order-list__row header">
          <span>Pair</span>
          <span>Type</span>
          <span>Price</span>
          <span>Amount</span>
          <span>Filled</span>
          <span>Total</span>
          <span>Status</span>
        </div>

        {orders.map(order => (
          <div
            className={`order-list__row ${order.type.toLowerCase()}`}
            key={order.id}
          >
            <span>{order.pair}</span>
            <span className={`type ${order.type.toLowerCase()}`}>
              {order.type}
            </span>
            <span>{order.price.toLocaleString()}</span>
            <span>{order.amount.toFixed(3)}</span>
            <span>{order.filled.toFixed(3)}</span>
            <span>
              {order.total.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </span>
            <span className={`status ${order.status.toLowerCase()}`}>
              {order.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export { OrderList }
