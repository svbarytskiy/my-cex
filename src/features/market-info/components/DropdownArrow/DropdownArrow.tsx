// components/DropdownArrow/DropdownArrow.tsx

import React, { forwardRef } from 'react'; 
import styles from './DropdownArrow.module.css';

interface DropdownArrowProps {
  isOpen: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const DropdownArrow = forwardRef<HTMLButtonElement, DropdownArrowProps>(
  ({ isOpen, onClick }, ref) => (
    <button
      ref={ref}
      type="button"
      className={styles.dropdownArrow}
      onClick={onClick}
      aria-expanded={isOpen}
      aria-label={isOpen ? 'Collapse dropdown' : 'Expand dropdown'}
    >
      <svg
        className={`${styles.arrowIcon} ${isOpen ? styles.rotated : ''}`}
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
  )
);

DropdownArrow.displayName = 'DropdownArrow';

export { DropdownArrow };