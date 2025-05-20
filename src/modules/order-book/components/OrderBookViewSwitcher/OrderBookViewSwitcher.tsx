// src/features/trading/ui/orderbook-view-switcher/ui/OrderBookViewSwitcher.tsx
import { useState } from 'react';
import styles from './OrderBookViewSwitcher.module.css';

// SVG-іконки як React-компоненти (оптимізовано, без завантаження зовні)
const Icons = {
    default: (
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill="#EF454A" d="M2 3h6v6H2z" />
            <path fill="#20B26C" d="M2 11h6v6H2z" />
            <g fill="#fff" opacity="0.8">
                <path d="M10 3h8v2h-8zM10 7h8v2h-8zM10 11h8v2h-8zM10 15h8v2h-8z" />
            </g>
        </svg>
    ),
    // grouped: (
    //     <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    //         <path fill="#EF454A" d="M17 2v6h-6V2z" opacity="0.4" />
    //         <path fill="#20B26C" d="M9 2v6H3V2z" opacity="0.4" />
    //         <g fill="#fff" opacity="0.8">
    //             <path d="M17 10v8h-2v-8zM13 10v8h-2v-8zM9 10v8H7v-8zM5 10v8H3v-8z" />
    //         </g>
    //     </svg>
    // ),
    bidsOnly: (
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill="#20B26C" d="M2 3h6v14H2z" />
            <path fill="#fff" d="M10 3h8v2h-8zm0 4h8v2h-8zm0 4h8v2h-8zm0 4h8v2h-8z" opacity="0.8" />
        </svg>
    ),
    asksOnly: (
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill="#EF454A" d="M2 3h6v14H2z" />
            <path fill="#fff" d="M10 3h8v2h-8zm0 4h8v2h-8zm0 4h8v2h-8zm0 4h8v2h-8z" opacity="0.8" />
        </svg>
    )
};

export const OrderBookViewSwitcher = () => {
    const [activeView, setActiveView] = useState<'default' | 'grouped' | 'bidsOnly' | 'asksOnly'>('default');

    return (
        <div className={styles.container}>
            {Object.entries(Icons).map(([key, icon]) => (
                <button
                    key={key}
                    className={`${styles.iconButton} ${activeView === key ? styles.active : ''}`}
                    onClick={() => setActiveView(key as any)}
                    aria-label={`Switch to ${key} view`}
                >
                    {icon}
                </button>
            ))}
        </div>
    );
};