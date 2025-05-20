import React from "react";
import "./styles.css";

interface OrderBookRowProps {
    price: string;
    quantity: string;
    total?: string;
    maxQuantity: number;
    type: 'bid' | 'ask';
}

const OrderBookRow = React.memo<OrderBookRowProps>(({ price, quantity, total, type, maxQuantity }) => {
    const qty = parseFloat(quantity);
    const fillPercent = Math.min(100, (qty / maxQuantity) * 100);

    const backgroundColor = type === 'bid'
        ? 'rgba(37, 167, 80, 0.12)'
        : 'rgba(202, 63, 100, 0.12)';
    return (
        <div className={`order-book__row ${type}`} key={`${type}-${price}`}>
            <div
                className="order-book__fill"
                style={{
                    width: `${fillPercent}%`,
                    backgroundColor
                }}
            />
            <div className={`order-book__cell price ${type}`}>{parseFloat(price).toFixed(2)}</div>
            <div className="order-book__cell">{parseFloat(quantity).toFixed(4)}</div>
            <div className="order-book__cell">{total ? parseFloat(total).toFixed(6) : ''}</div>
            <div
                className={`order-book__cell ${type}`}
                style={{ width: `${100}%` }}
            />
        </div>
    )
});

export default OrderBookRow;