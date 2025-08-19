import { SortDirection } from '../../types/model'
import { FC, memo } from 'react'

interface SortDirectionIconProps {
  currentSortDirection: SortDirection
  className?: string
}

const SortDirectionIcon: FC<SortDirectionIconProps> = memo(
  ({ currentSortDirection, className }) => {
    return (
      <svg
        className={`flex-shrink-0 ml-[-2px] text-[var(--icon-normal,#888888)] transition-colors duration-200 ease-in-out ${className || ''}`}
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className={`opacity-50 transition-opacity duration-200 ease-in-out ${currentSortDirection === 'asc' ? 'opacity-100 text-[var(--text-primary,#ffffff)]' : ''}`}
          d="M8.75 8.849V10.5h6.5V8.85L12 5.348l-3.25 3.5z"
          fill="currentColor"
        />

        <path
          className={`opacity-50 transition-opacity duration-200 ease-in-out ${currentSortDirection === 'desc' ? 'opacity-100 text-[var(--text-primary,#ffffff)]' : ''}`}
          d="M8.75 15.151V13.5h6.5v1.652l-3.25 3.5-3.25-3.5z"
          fill="currentColor"
        />
      </svg>
    )
  },
)

SortDirectionIcon.displayName = 'SortDirectionIcon'

export { SortDirectionIcon }
