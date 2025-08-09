import { ReactNode, FC } from 'react'
import clsx from 'clsx'

interface OneColumnWrapperProps {
  children: ReactNode
  className?: string
}

const OneColumnWrapper: FC<OneColumnWrapperProps> = ({
  children,
  className,
}) => {
  const baseTailwindClasses =
    'flex flex-[5_1_0] min-w-[60px] justify-end flex-nowrap truncate max-w-[70%]'

  return <div className={clsx(baseTailwindClasses, className)}>{children}</div>
}

export { OneColumnWrapper }
