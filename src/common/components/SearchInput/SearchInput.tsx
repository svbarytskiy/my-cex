import { FC, useState, useRef, useCallback, memo, ChangeEvent } from 'react'
import styles from './SearchInput.module.css'

interface SearchInputProps {
  initialValue?: string
  placeholder?: string
  onSearchChange?: (value: string) => void
  onClear?: () => void
}

const SearchInput: FC<SearchInputProps> = memo(
  ({ initialValue = '', placeholder = 'Search', onSearchChange, onClear }) => {
    const [inputValue, setInputValue] = useState(initialValue)
    const inputRef = useRef<HTMLInputElement>(null)

    const handleChange = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        setInputValue(value)
        onSearchChange?.(value)
      },
      [onSearchChange],
    )

    const handleClearClick = useCallback(() => {
      setInputValue('')
      inputRef.current?.focus()
      onClear?.()
      onSearchChange?.('')
    }, [onClear, onSearchChange])

    return (
      <div className={styles.searchInputContainer}>
        <span className={styles.searchIcon} aria-hidden="true">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </span>

        <input
          ref={inputRef}
          type="text"
          className={styles.inputField}
          value={inputValue}
          onChange={handleChange}
          placeholder={placeholder}
          aria-label="Search"
        />

        {inputValue && (
          <button
            type="button"
            className={styles.clearButton}
            onClick={handleClearClick}
            aria-label="Clear search input"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>
    )
  },
)

SearchInput.displayName = 'SearchInput'

export { SearchInput }
