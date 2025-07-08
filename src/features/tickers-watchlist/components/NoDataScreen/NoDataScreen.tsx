import { FC } from 'react'
import styles from './NoDataScreen.module.css'
import { NoDataIcon } from 'common/components/icons/NoDataIcon/NoDataIcon'

interface NoDataScreenProps {
  message?: string
  iconSize?: number
  color?: string
  className?: string
}

const NoDataScreen: FC<NoDataScreenProps> = ({
  message = 'No data available.',
  iconSize = 90,
  color = '#888', 
  className,
}) => {
  return (
    <div
      className={`${styles.noDataContainer} ${className || ''}`}
      style={{ color: color }}
    >
      <NoDataIcon
        width={iconSize}
        height={iconSize}
        color={color}
        className={styles.noDataIcon}
        opacity={1}
      />
      <p className={styles.noDataText}>{message}</p>
    </div>
  )
}

export { NoDataScreen }
