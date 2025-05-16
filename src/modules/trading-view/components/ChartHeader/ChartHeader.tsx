// src/modules/trading-view/components/ChartHeader/ChartHeader.tsx
import { FC } from "react";
import styles from "./ChartHeader.module.css";

interface ChartHeaderProps {
  activeView: "standard" | "tradingview" | "depth";
  onViewChange: (view: "standard" | "tradingview" | "depth") => void;
}

export const ChartHeader: FC<ChartHeaderProps> = ({ 
  activeView, 
  onViewChange 
}) => {
  const views = {
    standard: "Стандартный",
    tradingview: "Trading View",
    depth: "Глубина",
  };

  return (
    <div className={styles.chart__head}>
      <div className={styles.chart__head_left}>График</div>
      <div className={styles.chart__head_right}>
        <div className={styles.chart__head_right_sw}>
          {Object.entries(views).map(([key, label]) => (
            <div
              key={key}
              className={`${styles.chart__head_right_item} ${
                activeView === key ? styles.active : ""
              }`}
              onClick={() => onViewChange(key as "standard" | "tradingview" | "depth")}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};