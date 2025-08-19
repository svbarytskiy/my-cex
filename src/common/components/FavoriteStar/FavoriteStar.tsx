import { FC, memo } from 'react'
import clsx from 'clsx'

interface FavoriteStarProps {
  isActive: boolean
  onClick: () => void
  hasBorder?: boolean
  className?: string
}

const FavoriteStar: FC<FavoriteStarProps> = memo(
  ({ className, isActive, onClick, hasBorder = true }) => {
    return (
      <button
        className={clsx(
          'flex items-center justify-center',
          'bg-transparent',
          'border',
          'border-border-color',
          'cursor-pointer',
          'text-border-color',
          'w-6 h-6',
          'rounded-[25%]',
          'box-border',
          'transition-colors',
          isActive && ' text-accent-primary',
          !hasBorder && 'border-none',
          'hover:opacity-80',
          !hasBorder && 'hover:text-[var(--text-primary,#fff)]',
          className,
        )}
        onClick={onClick}
        aria-label={isActive ? 'Remove from favorites' : 'Add to favorites'}
      >
        <svg
          className="w-4 h-4 transition-colors flex-shrink-0 m-auto"
          viewBox="0 0 24 24"
          fill={isActive ? '#f0b90b' : 'currentColor'}
          stroke={isActive ? '#f0b90b' : 'currentColor'}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          width="12px"
          height="12px"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      </button>
    )
  },
)

FavoriteStar.displayName = 'FavoriteStar'

export { FavoriteStar }
