import React from 'react';
import './styles.css';

interface OrderRatioProps {
    buyPercent: number;
    sellPercent?: number;
    buyLabel?: string;
    sellLabel?: string;
    buyColor?: string;
    sellColor?: string;
}

const OrderRatio: React.FC<OrderRatioProps> = ({
    buyPercent,
    sellPercent = 100 - buyPercent,
    buyLabel = 'B',
    sellLabel = 'S',
    buyColor = '#25a750',
    sellColor = '#ca3f64'
}) => {
    const validatedBuy = Math.min(100, Math.max(0, buyPercent));
    const validatedSell = 100 - validatedBuy;

    return (
        <div className="order-ratio-wrapper">
            <div
                className="order-ratio-segment buy"
                style={{
                    width: `${validatedBuy}%`,
                    minWidth: '80px',
                    backgroundColor: `${buyColor}33`,
                    '--main-color': buyColor
                } as React.CSSProperties}
            >
                <div className="order-ratio-content">
                    <span
                        className="order-ratio-badge"
                        style={{ borderColor: buyColor, color: buyColor }}
                    >
                        {buyLabel}
                    </span>
                    <span style={{ color: buyColor }}>
                        {validatedBuy.toFixed(2)}%
                    </span>
                </div>
            </div>

            <div
                className="order-ratio-segment sell"
                style={{
                    width: `${validatedSell}%`,
                    minWidth: '80px',
                    backgroundColor: `${sellColor}33`,
                    '--main-color': sellColor
                } as React.CSSProperties}
            >
                <div className="order-ratio-content">
                    <span style={{ color: sellColor }}>
                        {validatedSell.toFixed(2)}%
                    </span>
                    <span
                        className="order-ratio-badge"
                        style={{ borderColor: sellColor, color: sellColor }}
                    >
                        {sellLabel}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default OrderRatio;
