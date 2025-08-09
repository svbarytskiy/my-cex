import { type MouseEvent, forwardRef } from 'react'

interface DropdownArrowProps {
  isOpen: boolean
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void
}

const DropdownArrow = forwardRef<HTMLButtonElement, DropdownArrowProps>(
  ({ isOpen, onClick }, ref) => (
    <button
      ref={ref}
      type="button"
      className="
        bg-transparent
        flex justify-center items-center
        cursor-pointer
        border-none
        w-6 h-6 p-0
        flex-shrink-0
        text-gray-400 hover:text-white
        focus:outline-none
      "
      onClick={onClick}
      aria-expanded={isOpen}
      aria-label={isOpen ? 'Collapse dropdown' : 'Expand dropdown'}
    >
      <svg
        className={`
          transition-transform duration-200 ease-in-out
          ${isOpen ? 'rotate-180' : ''}
        `}
        width="16"
        height="16"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3 4.5L6 7.5L9 4.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  ),
)

DropdownArrow.displayName = 'DropdownArrow'

export { DropdownArrow }
