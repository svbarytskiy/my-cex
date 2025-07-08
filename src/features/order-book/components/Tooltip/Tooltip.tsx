import React from 'react'
import styles from './Tooltip.module.css'

interface TooltipProps {
  targetElement: {
    top: number
    right: number
  }
  data: {
    avgPrice: string
    total: string
    count: number
  } | null
}

export const Tooltip: React.FC<TooltipProps> = ({ targetElement, data }) => {
  if (!targetElement) return null
  if (!data) return null

  return (
    <div
      className={styles.tooltipContainer}
      style={{
        position: 'absolute',
        transform: `translateY(${targetElement.top - 50}px)`,
        right: `calc(100% + 5px)`,
        zIndex: 9999,
      }}
    >
      <div className={styles.tooltipRow}>
        <span>Avg Price:</span>
        <span>{data.avgPrice}</span>
      </div>
      <div className={styles.tooltipRow}>
        <span>Total Volume:</span>
        <span>{data.total}</span>
      </div>
      <div className={styles.tooltipRow}>
        <span>Orders Count:</span>
        <span>{data.count}</span>
      </div>
    </div>
  )
}
