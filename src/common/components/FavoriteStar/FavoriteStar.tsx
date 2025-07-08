import { FC, memo } from 'react'
import styles from './FavoriteStar.module.css'

interface FavoriteStarProps {
  isActive: boolean
  onClick: () => void
  hasBorder?: boolean
}

const FavoriteStar: FC<FavoriteStarProps> = memo(
  ({ isActive, onClick, hasBorder = true }) => {
    return (
      <button
        className={`${styles.favoriteBtn} ${isActive ? styles.active : ''} ${
          !hasBorder ? styles.noBorder : ''
        }`}
        onClick={onClick}
        aria-label={isActive ? 'Remove from favorites' : 'Add to favorites'}
      >
        <svg
          width="16px" // Збільшимо розмір SVG для кращої відповідності скріншоту
          height="16px"
          viewBox="0 0 24 24"
          fill={isActive ? '#fadb14' : 'currentColor'}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      </button>
    )
  },
)

FavoriteStar.displayName = 'FavoriteStar'

export { FavoriteStar }
