// import { ArrowDownIcon } from '../../icons/ArrowDownIcon'
// import { DrawingIcon } from '../../icons/DrawingIcon'
// import { IndicatorIcon } from '../../icons/IndicatorIcon'
// import { PlusIcon } from '../../icons/PlusIcon'
import { FC } from 'react'
import clsx from 'clsx'
import { KlineInterval } from 'app/store/slices/candles/types'

const timeIntervals = [
  '1s',
  '1m',
  '3m',
  '5m',
  '15m',
  '30m',
  '1h',
  '4h',
  '1d',
  '1w',
  '1M',
]

interface TradingToolbarProps {
  activeInterval: KlineInterval
  onIntervalChange: (interval: KlineInterval) => void
}

export const Toolbar: FC<TradingToolbarProps> = ({
  activeInterval,
  onIntervalChange,
}) => {
  return (
    <div className="flex items-center h-8 box-border">
      <div className="flex items-center mr-2">
        <div className="flex text-xs">
          {timeIntervals.map(interval => (
            <div
              key={interval}
              onClick={() => onIntervalChange(interval as KlineInterval)}
              className={clsx(
                'px-1.5 h-6 flex items-center justify-center cursor-pointer duration-150 rounded-sm mr-0.5 select-none',
                'hover:text-text-primary',
                {
                  'text-text-secondary': activeInterval !== interval,
                  'text-text-primary font-semibold':
                    activeInterval === interval,
                },
              )}
            >
              {interval}
            </div>
          ))}
        </div>
        {/* <ArrowDownIcon className="w-4 h-4 ml-1 cursor-pointer text-text-secondary hover:text-text-primary" /> */}
      </div>

      {/* <div className="w-px h-5 bg-border-color mx-2" />

      <div className="flex items-center">
        <div className="flex items-center justify-center w-6 h-6 mr-2 cursor-pointer text-text-secondary hover:text-text-primary">
          <DrawingIcon />
        </div>

        <div className="flex items-center justify-center w-6 h-6 mr-2 cursor-pointer text-text-secondary hover:text-text-primary">
          <IndicatorIcon />
        </div>

        <div className="flex items-center justify-center w-6 h-6 mr-2 cursor-pointer text-text-secondary hover:text-text-primary">
          <span className="text-base icon-kline-candles" />
        </div>

        <div className="flex items-center justify-center w-6 h-6 cursor-pointer text-text-secondary hover:text-text-primary">
          <PlusIcon />
        </div>
      </div> */}
    </div>
  )
}
