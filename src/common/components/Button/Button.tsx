import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react'
import clsx from 'clsx'
import styles from './Button.module.css'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  size?: 'sm' | 'm' | 'l' | 'xl'
  color?: 'primary' | 'secondary' | 'tertiary'
  className?: string
}

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ children, size = 'm', color = 'primary', className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(styles.button, styles[size], styles[color], className)}
        {...props}
      >
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'
