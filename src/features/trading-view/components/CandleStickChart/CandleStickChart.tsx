import { FC, useEffect } from 'react'
import { CandlestickData } from 'lightweight-charts'
import { useCHartsSetup } from '../../hooks/useChartsSetup'

interface CandleStickChartProps {
  candles: CustomCandleData[]
  streamingData: CustomCandleData
}

export interface CustomCandleData extends CandlestickData {
  volume: number
}

const CandleStickChart: FC<CandleStickChartProps> = ({
  candles,
  streamingData,
}) => {
  const { chartContainerRef, updateCandle } = useCHartsSetup(candles)

  useEffect(() => {
    updateCandle(streamingData)
  }, [streamingData])

  return <div ref={chartContainerRef} className='w-full h-125 md:h-85 lg:h-128' />
}

export { CandleStickChart }
