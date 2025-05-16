// src/modules/trading-view/components/TimeIntervalBar/TimeIntervalBar.tsx
import { FC } from "react";
// import { ArrowDownIcon } from "../../icons";
import styles from "./TimeIntervalBar.module.css";

const intervals = ["1s", "1m", "3m", "5m", "15m", "30m", "1h", "4h", "1d", "1w", "1M"];

interface TimeIntervalBarProps {
  activeInterval: string;
  onIntervalChange: (interval: string) => void;
}

export const TimeIntervalBar: FC<TimeIntervalBarProps> = ({
  activeInterval,
  onIntervalChange,
}) => {
  return (
    <div className={styles.self_tool_time_intervals}>
      {intervals.map((interval) => (
        <div
          key={interval}
          className={`${styles.self_tool_time_interval_item} ${
            activeInterval === interval ? styles.active : ""
          }`}
          onClick={() => onIntervalChange(interval)}
        >
          {interval}
        </div>
      ))}
      {/* <ArrowDownIcon className={styles.time_interval_icon} /> */}
    </div>
  );
};