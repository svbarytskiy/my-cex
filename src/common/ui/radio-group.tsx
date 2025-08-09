import { forwardRef } from 'react'
import { cn } from 'common/utils/cn'

export interface RadioGroupItemProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

const RadioGroup = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn('grid gap-2', className)} {...props} />
})

RadioGroup.displayName = 'RadioGroup'

const RadioGroupItem = forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <label className="flex items-center space-x-2 cursor-pointer">
        <input
          type="radio"
          ref={ref}
          className={cn('peer sr-only', className)}
          {...props}
        />
        <div
          className={cn(
            'h-4 w-4 rounded-full border border-border bg-background',
            'peer-focus-visible:outline-none peer-focus-visible:ring-1 peer-focus-visible:ring-ring',
            'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
            'flex items-center justify-center',
          )}
        >
          <div
            className={cn(
              'h-2.5 w-2.5 rounded-full bg-primary transition-transform duration-100 ease-in-out',
              props.checked
                ? 'scale-100 bg-accent-primary opacity-100'
                : 'scale-0 opacity-0',
            )}
          />
        </div>
        {label && (
          <span className="text-sm leading-none peer-disabled:opacity-70">
            {label}
          </span>
        )}
      </label>
    )
  },
)

RadioGroupItem.displayName = 'RadioGroupItem'

export { RadioGroup, RadioGroupItem }
