import { FC, useState, useRef, useCallback, memo, ChangeEvent } from 'react'
import { Search } from 'lucide-react'

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
      <div
        className="
          relative flex items-center w-full rounded-lg p-[5px] box-border
          bg-input-bg border border-border-color
          hover:border-hover-color focus-within:border-hover-color
        "
      >
        <span
          className="flex items-center justify-center text-text-secondary mr-2.5 flex-shrink-0"
          aria-hidden="true"
        >
          <Search className="w-4 h-4" />
        </span>
        <input
          ref={inputRef}
          type="text"
          className="
            flex-grow border-none bg-transparent p-0 outline-none
            text-text-primary text-sm
            placeholder-text-placeholder-color placeholder-opacity-70
          "
          value={inputValue}
          onChange={handleChange}
          placeholder={placeholder}
          aria-label="Search"
        />

        {inputValue && (
          <button
            type="button"
            className="
              flex items-center justify-center bg-none border-none cursor-pointer
              text-icon-color ml-2.5 p-0 flex-shrink-0
              hover:text-icon-hover-color
            "
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
              className="w-4 h-4"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
    )
  },
)

SearchInput.displayName = 'SearchInput'

export { SearchInput }
