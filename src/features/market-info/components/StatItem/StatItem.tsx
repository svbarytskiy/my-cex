import { FC, ReactNode } from 'react'
import clsx from 'clsx'

interface StatItemProps {
  label: string
  value: string | number | ReactNode
  className?: string
}

const StatItem: FC<StatItemProps> = ({ label, value, className }) => {
  return (
    <div
      className={clsx(
        'flex md:gap-2 flex-col lg:pr-2 flex-none min-w-[50px]',
        className,
      )}
    >
      <div className="text-[10px] whitespace-nowrap leading-[16px] md:text-xs md:leading-tight text-text-secondary">
        {label}
      </div>
      <div className="text-xs whitespace-nowrap leading-[16px] md:text-xs md:leading-tight text-text-primary">
        {value}
      </div>
    </div>
  )
}

export { StatItem }
