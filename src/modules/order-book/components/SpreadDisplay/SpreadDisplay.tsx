import React, { useEffect, useRef, useState } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import './styles.css';

interface SpreadData {
    value: string;
    percentage: string;
}

interface SpreadProps {
    price: string; // ціна спреду або остання ціна
    spread: SpreadData;
}

const SpreadDisplay: React.FC<SpreadProps> = ({ price, spread }) => {
    const prevPriceRef = useRef<number | null>(null);
    const [direction, setDirection] = useState<'up' | 'down' | 'neutral'>('neutral');

    useEffect(() => {
        const currentPrice = parseFloat(price);
        const prevPrice = prevPriceRef.current;

        if (prevPrice !== null) {
            if (currentPrice > prevPrice) setDirection('up');
            else if (currentPrice < prevPrice) setDirection('down');
            else setDirection('neutral');
        }

        prevPriceRef.current = currentPrice;
    }, [price]);

    const getColor = () => {
        switch (direction) {
            case 'up':
                return '#0ecb81'; // зелений
            case 'down':
                return '#ff4d4f'; // червоний
            default:
                return '#ffff'; // сірий
        }
    };

    return (
        <div className="order-book__spread">
            <div style={{ color: getColor(), display: 'flex', alignItems: 'center', gap: 4, fontSize: 20, fontWeight: 600 }}>
                {direction === 'up' && <ArrowUp size={14} />}
                {direction === 'down' && <ArrowDown size={14} />}
                {parseFloat(price).toFixed(2)}
            </div>
            <div className="spread-info" style={{ color: '#999' }}>
                Spread: {spread.value} ({spread.percentage}%)
            </div>
        </div>
    );
};

export default SpreadDisplay;
