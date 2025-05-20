// src/features/trading/ui/price-aggregation/ui/PriceAggregationSelector.tsx
import React, { useState, useEffect } from 'react';
import styles from './PriceAggregationSelector.module.css';

// Типизація
type AggregationLevel = {
    value: number;
    label: string;
};

type PairSettings = {
    [pair: string]: AggregationLevel[];
};

// Налаштування для різних пар (можна винести в config)
// const PAIR_AGGREGATION_LEVELS: PairSettings = {
//     'BTCUSDT': [
//         { value: 0.1, label: '0.1' },
//         { value: 0.5, label: '0.5' },
//         { value: 1, label: '1' },
//         { value: 5, label: '5' },
//         { value: 10, label: '10' }
//     ],
//     'ETHUSDT': [
//         { value: 0.01, label: '0.01' },
//         { value: 0.05, label: '0.05' },
//         { value: 0.1, label: '0.1' },
//         { value: 0.5, label: '0.5' },
//         { value: 1, label: '1' }
//     ],
//     // Додати інші пари...
// };

interface PriceAggregationSelectorProps {
    currentPair: string;
    tickSize: number;

    onAggregationChange: (value: number) => void;
}

export const PriceAggregationSelector = ({
    tickSize,
    onAggregationChange,
 
}: PriceAggregationSelectorProps) => {
    const aggregationLevels = calculateAggregationLevels(tickSize, 100000); // Тут можна передати ціну, якщо потрібно
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState<number>(aggregationLevels[0] || tickSize);

    function calculateAggregationLevels(tickSize: number, price: number): number[] {
        const steps: number[] = [];
        let step = tickSize;

        while (step <= price / 100) {
            steps.push(step);
            step *= 10;

            if (steps.length > 7) break;
        }

        if (steps.length === 0) {
            steps.push(tickSize);
        }

        return steps;
    }

    return (
        <div
            className={styles.container}
            tabIndex={1}
            onBlur={() => setIsOpen(false)}
        >
            <div
                className={styles.selector}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className={styles.selectedValue}>
                    {selectedValue.toFixed(selectedValue < 1 ? 2 : 1)}
                </div>
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 1024 1024"
                    className={`${styles.arrow} ${isOpen ? styles.rotated : ''}`}
                >
                    <path
                        fill="currentColor"
                        d="m561.707 657.75 194.389-262.23a60.416 60.416 0 0 0-13.312-85.077 62.165 62.165 0 0 0-36.437-11.776H317.653c-34.048 0-61.653 27.264-61.653 60.885 0 12.928 4.181 25.515 11.904 35.968l194.347 262.23a62.123 62.123 0 0 0 99.498 0z"
                    />
                </svg>
            </div>

            {isOpen && (
                <div className={styles.dropdown}>
                    {aggregationLevels.map((value) => (
                        <div
                            key={value}
                            className={`${styles.option} ${selectedValue === value ? styles.active : ''}`}
                            onClick={() => {
                                setSelectedValue(value);
                                onAggregationChange(value);
                                setIsOpen(false);
                            }}
                        >
                            {value.toFixed(value < 1 ? 2 : 1)}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};