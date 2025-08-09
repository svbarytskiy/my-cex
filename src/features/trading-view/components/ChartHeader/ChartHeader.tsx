import { FC } from 'react'
import { Toolbar } from '../Toolbar/Toolbar'
import { KlineInterval } from 'binance/types/kline'
import { clsx } from 'clsx'
import { HorizontalScrollContainer } from 'common/components/HorizontalScrollContainer/HorizontalScrollContainer'

interface ChartHeaderProps {
  activeView: 'standard' | 'tradingview' | 'depth'
  onViewChange: (view: 'standard' | 'tradingview' | 'depth') => void
  activeInterval: KlineInterval
  onIntervalChange: (interval: KlineInterval) => void
}

export const ChartHeader: FC<ChartHeaderProps> = ({
  activeView,
  onViewChange,
  activeInterval,
  onIntervalChange,
}) => {
  const views = {
    standard: 'Original',
    tradingview: 'Trading View',
    depth: 'Depth',
  }

  return (
    <div className="flex flex-row  md:max-w-full justify-between items-center px-2 md:px-3 md:py-1 border-b border-border-color gap-2 md:gap-0">
      <HorizontalScrollContainer>
        <Toolbar
          activeInterval={activeInterval}
          onIntervalChange={onIntervalChange}
        />
        <div className="text-xs text-text-secondary ml-auto md:w-auto flex items-center" >
          <div className="flex relative bg-background-tertiary rounded-md items-center justify-between md:justify-start">
            {Object.entries(views).map(([key, label]) => (
              <div
                key={key}
                className={clsx(
                  'relative flex justify-center items-center truncate text-center md:text-left text-text-secondary text-xs font-medium py-1  px-2 md:px-3 cursor-pointer transition-all duration-200 rounded-sm',
                  'hover:text-text-primary ',
                  {
                    'text-white bg-background-tertiary-hover font-semibold':
                      activeView === key,
                  },
                )}
                onClick={() =>
                  onViewChange(key as 'standard' | 'tradingview' | 'depth')
                }
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </HorizontalScrollContainer>
    </div>
  )
}
