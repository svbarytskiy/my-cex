import { useState, useMemo } from 'react'

interface PriceAggregationSelectorProps {
  price: string
  tickSize: number
  precision: number
  onAggregationChange: (value: number) => void
}

function calculateAggregationLevels(tickSize: number, price: number): number[] {
  const steps: number[] = []
  let step = tickSize

  while (step <= price / 100) {
    steps.push(step)
    step *= 10

    if (steps.length > 5) break
  }

  if (steps.length === 0) {
    steps.push(tickSize)
  }

  return steps
}

export const PriceAggregationSelector = ({
  tickSize,
  price,
  precision,
  onAggregationChange,
}: PriceAggregationSelectorProps) => {
  const aggregationLevels = useMemo(
    () => calculateAggregationLevels(tickSize, Number(price)),
    [tickSize, price],
  )

  const [isOpen, setIsOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState<number>(
    aggregationLevels[0] || precision,
  )

  return (
    <div className="relative w-20" tabIndex={1} onBlur={() => setIsOpen(false)}>
      <div
        className="flex items-center justify-between px-2 py-1 bg-background-tertiary rounded-md cursor-pointer transition-all duration-200 h-[18px] border border-transparent hover:bg-background-tertiary-hover" // Replaces .selector & .selector:hover
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="text-xs font-medium text-[#eaecef]">
          {selectedValue}
        </div>
        <svg
          width="16"
          height="16"
          viewBox="0 0 1024 1024"
          className={`transition-transform duration-200 text-[#81858c] ${isOpen ? 'rotate-180' : ''}`}
        >
          <path
            fill="currentColor"
            d="m561.707 657.75 194.389-262.23a60.416 60.416 0 0 0-13.312-85.077 62.165 62.165 0 0 0-36.437-11.776H317.653c-34.048 0-61.653 27.264-61.653 60.885 0 12.928 4.181 25.515 11.904 35.968l194.347 262.23a62.123 62.123 0 0 0 99.498 0z"
          />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-background-tertiary rounded-md mt-1 z-50 shadow-lg max-h-[220px] overflow-y-auto">
          {aggregationLevels.map(value => (
            <div
              key={value}
              className={`px-3 py-2 text-xs text-[#eaecef] cursor-pointer transition-colors duration-100 hover:bg-background-tertiary-hover ${selectedValue === value ? 'text-accent-primary bg-[rgba(240,185,11,0.1)]' : ''}`} // Replaces .option, .option:hover, & .option.active
              onClick={() => {
                setSelectedValue(value)
                onAggregationChange(value)
                setIsOpen(false)
              }}
            >
              {value}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
