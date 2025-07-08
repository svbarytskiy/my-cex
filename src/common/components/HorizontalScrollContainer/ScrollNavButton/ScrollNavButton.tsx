import { FC, memo } from 'react'
import styles from './ScrollNavButton.module.css'

interface ScrollNavButtonProps {
  direction: 'left' | 'right'
  onClick: () => void
  isVisible: boolean
}

const ScrollNavButton: FC<ScrollNavButtonProps> = memo(
  ({ direction, onClick, isVisible }) => {
    if (!isVisible) return null

    return (
      <button
        type="button"
        className={`${styles.navButton} ${styles[direction]}`}
        onClick={onClick}
        aria-label={`Scroll ${direction}`}
      >
        {direction === 'left' ? '❮' : '❯'}
      </button>
    )
  },
)

ScrollNavButton.displayName = 'ScrollNavButton'

export { ScrollNavButton }
