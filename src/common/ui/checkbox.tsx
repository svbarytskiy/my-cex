import { Check } from 'lucide-react'
import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from 'common/utils/cn'

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  color?: string
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => {
    return (
      <label className="relative flex items-center cursor-pointer">
        <input
          type="checkbox"
          className={cn('peer sr-only', className)}
          ref={ref}
          {...props}
        />
        <div
          className={cn(
            'h-4 w-4 shrink-0 rounded-sm border border-primary bg-background',
            'peer-focus-visible:outline-none peer-focus-visible:ring-1 peer-focus-visible:ring-ring',
            'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
            'peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground',
            'flex items-center justify-center transition-all',
          )}
        >
          <Check
            className={cn(
              'h-4 w-4 font-bold text-primary-foreground transition-opacity',
              props.checked ? 'opacity-100' : 'opacity-0',
            )}
          />
        </div>
      </label>
    )
  },
)

Checkbox.displayName = 'Checkbox'
export { Checkbox }
