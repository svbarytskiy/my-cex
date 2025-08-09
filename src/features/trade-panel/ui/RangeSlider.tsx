import clsx from 'clsx'
import { FC, useState } from 'react'

const TradingRangeSlider: FC = () => {
  const [sliderValue, setSliderValue] = useState(0)

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    setSliderValue(value)
    e.currentTarget.style.setProperty('--slider-value', `${value}%`)
  }

  const breakpoints = [0, 25, 50, 75, 100]

  return (
    <>
      <div className="my-3 px-2 relative w-full">
        <div className="relative  w-full h-1 rounded-sm">
          <div
            className="absolute inset-0 h-full bg-border-color rounded-sm transition-all duration-200"
            style={{
              background: `linear-gradient(to right, var(--accent-primary) ${sliderValue}%, var(--border-color) ${sliderValue}%)`,
            }}
          ></div>

          {breakpoints.map(breakpoint => (
            <div
              key={breakpoint}
              className={clsx(
                'absolute w-3 h-3 rounded-full border-2 border-solid bg-background-secondary',
                {
                  'border-accent-primary': sliderValue >= breakpoint,
                  'border-border-color': sliderValue < breakpoint,
                },
                'transition-colors duration-200',
              )}
              style={{
                left: `${breakpoint}%`,
                transform: `translateX(-50%) translateY(-50%)`,
                top: '50%',
              }}
            ></div>
          ))}
        </div>
        <input
          type="range"
          min="0"
          max="100"
          step="25"
          value={sliderValue}
          onChange={handleSliderChange}
          className="custom-range-slider absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 appearance-none"
        />
        <div className="flex w-full justify-between mt-1.5 text-xs text-text-secondary">
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>
      </div>
    </>
  )
}

export default TradingRangeSlider
