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

  return (
    <div ref={chartContainerRef} style={{ width: '100%', height: '400px' }} />
  )
}

export { CandleStickChart }
