import { FC, memo, Children, ReactNode } from 'react'
import clsx from 'clsx'

interface SeparatorColumnWrapperProps {
  children: ReactNode
  className?: string
}

export const SeparatorColumnWrapper: FC<SeparatorColumnWrapperProps> = memo(
  ({ children, className }) => {
    const childrenArray = Children.toArray(children)
    const baseGroupClasses =
      'flex items-center'

    const separatorClasses = 'text-[#999999] text-xs mx-1 flex-shrink-0' 

    if (childrenArray.length < 2) {
      return <div className={clsx(baseGroupClasses, className)}>{children}</div>
    }

    return (
      <div className={clsx(baseGroupClasses, className)}>

        {childrenArray.map((child, index) => (
          <div key={index} className="flex items-center max-w-full truncate">
            {child}
            {index < childrenArray.length - 1 && (
              <div className={separatorClasses}>/</div>
            )}
          </div>
        ))}
      </div>
    )
  },
)
