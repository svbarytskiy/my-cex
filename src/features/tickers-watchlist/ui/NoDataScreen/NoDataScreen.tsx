import { FC } from 'react'
import { NoDataIcon } from 'common/components/icons/NoDataIcon/NoDataIcon'

interface NoDataScreenProps {
  message?: string
  iconSize?: number
  color?: string
  className?: string
}

const NoDataScreen: FC<NoDataScreenProps> = ({
  message = 'No data available.',
  iconSize = 90,
  color = '#888', 
  className,
}) => {
  const textColorClass = color.startsWith('#') ? `text-[${color}]` : `text-${color}`;

  return (
    <div
      className={`flex flex-col justify-center items-center w-full h-full min-h-[130px] text-center p-5 box-border ${textColorClass} ${className || ''}`}
    >
      <NoDataIcon
        width={iconSize}
        height={iconSize}
        color={color}
        className="mb-2"
        opacity={1}
      />
      <p className="text-lg font-medium leading-normal">{message}</p>
    </div>
  )
}

export { NoDataScreen }