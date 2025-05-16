// src/components/TradingToolbar/TradingToolbar.tsx
import React from 'react';

import styles from './Toolbar.module.css';
import { ArrowDownIcon } from '../../icons/ArrowDownIcon';
import { DrawingIcon } from '../../icons/DrawingIcon';
import { IndicatorIcon } from '../../icons/IndicatorIcon';
import { PlusIcon } from '../../icons/PlusIcon';
import { KlineInterval } from '../../../../binance/types/kline';

const timeIntervals = ["1s", "1m", "3m", "5m", "15m", "30m", "1h", "4h", "1d", "1w", "1M"];

interface TradingToolbarProps {
  activeInterval: KlineInterval;
  onIntervalChange: (interval: KlineInterval) => void;
}

export const Toolbar: React.FC<TradingToolbarProps> = ({
  activeInterval,
  onIntervalChange,
}) => {
  return (
    <div className={styles.toolbarContainer}>
      <div className={styles.timeIntervalsContainer}>
        <div className={styles.timeIntervals}>
          {timeIntervals.map((interval) => (
            <div
              key={interval}
              className={`${styles.timeIntervalItem} ${activeInterval === interval ? styles.active : ''
                }`}
              onClick={() => onIntervalChange(interval)}
            >
              {interval}
            </div>
          ))}
        </div>
        <ArrowDownIcon className={styles.arrowIcon} />
      </div>

      <div className={styles.divider} />

      <div className={styles.toolsContainer}>
        <div className={styles.toolItem}>
          <DrawingIcon />
        </div>

        <div className={styles.toolItem}>
          <IndicatorIcon />
        </div>

        <div className={styles.toolItem}>
          <span className={`${styles.chartIcon} icon-kline-candles`} />
        </div>

        <div className={styles.toolItem}>
          <PlusIcon />
        </div>
      </div>
    </div>
  );
};