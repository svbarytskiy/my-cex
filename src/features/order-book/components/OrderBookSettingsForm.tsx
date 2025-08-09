import { Checkbox } from 'common/ui/checkbox'
import { RadioGroup, RadioGroupItem } from 'common/ui/radio-group'
import { FC } from 'react'

import {
  selectIsOrderRatioVisible,
  selectTotalColumnCurrency,
  selectTotalColumnType,
  toggleOrderRatioVisibility,
  setTotalColumnCurrency,
  setTotalColumnType,
} from '../order-book.slice'
import { useAppDispatch, useAppSelector } from 'app/store/store'

const TOTAL_COLUMN_CURRENCY_OPTIONS = [
  { value: 'base', label: 'Base' },
  { value: 'quote', label: 'Quote' },
] as const

const TOTAL_COLUMN_TYPE_OPTIONS = [
  { value: 'cumulative-sum', label: 'Cumulative sum' },
  { value: 'level-amount', label: 'Level amount' },
] as const

export const OrderBookSettingsForm: FC = () => {
  const dispatch = useAppDispatch()

  const isOrderRatioVisible = useAppSelector(selectIsOrderRatioVisible)
  const totalColumnCurrency = useAppSelector(selectTotalColumnCurrency)
  const totalColumnType = useAppSelector(selectTotalColumnType)

  return (
    <form className="absolute top-full right-0 z-20 w-55 p-4 rounded bg-background-tertiary text-text-primary border border-border-color shadow-md space-y-6">
      <div className="flex items-center gap-2">
        <Checkbox
          checked={isOrderRatioVisible}
          onChange={() => dispatch(toggleOrderRatioVisibility())}
        />
        <span className="text-sm text-text-primary">Show Order Ratio</span>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-text-secondary">Total Column Currency</p>
        <RadioGroup>
          {TOTAL_COLUMN_CURRENCY_OPTIONS.map(
            (
              { value, label },
            ) => (
              <RadioGroupItem
                key={value}
                label={label}
                value={value}
                checked={totalColumnCurrency === value}
                onChange={() => dispatch(setTotalColumnCurrency(value))}
              />
            ),
          )}
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium  text-text-secondary">Total Column Type</p>
        <RadioGroup>
          {TOTAL_COLUMN_TYPE_OPTIONS.map(
            (
              { value, label }, 
            ) => (
              <RadioGroupItem
                key={value}
                label={label}
                value={value}
                checked={totalColumnType === value}
                onChange={() => dispatch(setTotalColumnType(value))}
              />
            ),
          )}
        </RadioGroup>
      </div>
    </form>
  )
}
