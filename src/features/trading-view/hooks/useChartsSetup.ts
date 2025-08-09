import {
  createChart,
  ISeriesApi,
  SeriesType,
  ColorType,
  CandlestickSeriesPartialOptions,
  CandlestickSeries,
  HistogramSeries,
  CrosshairMode,
  CandlestickData,
} from 'lightweight-charts'
import { useRef, useEffect, useCallback } from 'react'
import { CustomCandleData } from '../components/CandleStickChart/CandleStickChart'

export const useCHartsSetup = (mockCandlestickData: CustomCandleData[]) => {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<ReturnType<typeof createChart> | null>(null)
  const seriesRef = useRef<ISeriesApi<SeriesType> | null>(null)
  const volumeSeriesRef = useRef<ISeriesApi<SeriesType> | null>(null)

  useEffect(() => {
    if (!chartContainerRef.current) return

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#181a20' },
        textColor: '#848e9c',
        panes: {
          separatorColor: '#363c45',
          separatorHoverColor: '#363c49',
          enableResize: true,
        },
      },
      grid: {
        vertLines: { color: '#363c45' },
        horzLines: { color: '#363c45' },
      },
      rightPriceScale: {
        borderColor: '#363c45',
      },
      timeScale: {
        borderColor: '#363c45',
        timeVisible: true,
        rightOffset: 15,
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      crosshair: {
        vertLine: {
          visible: true,
          color: '#848e9c',
          width: 1,
          labelBackgroundColor: '#2b3139',
        },
        horzLine: {
          visible: true,
          labelVisible: true,
          color: '#848e9c',
          labelBackgroundColor: '#2b3139',
        },
        mode: CrosshairMode.Normal,
      },
    })

    const seriesOptions: CandlestickSeriesPartialOptions = {
      upColor: '#0ecb81',
      downColor: '#f6465d',
      borderVisible: true,
      wickVisible: true,
      borderUpColor: '#0ecb81',
      borderDownColor: '#f6465d',
      wickUpColor: '#0ecb81',
      wickDownColor: '#f6465d',
    }
    const volumeSeries = chart.addSeries(
      HistogramSeries,
      { color: '#485c7b' },
      1,
    )
    volumeSeries.setData(
      mockCandlestickData.map(item => ({
        time: item.time,
        value: item.volume,
        color: item.close >= item.open ? '#0ecb81' : '#f6465d',
      })),
    )
    const candleSeries = chart.addSeries(CandlestickSeries, seriesOptions)
    candleSeries.setData(
      mockCandlestickData.map(item => ({
        time: item.time,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
      })),
    )
    chartRef.current = chart
    volumeSeriesRef.current = volumeSeries
    seriesRef.current = candleSeries

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        })
      }
    }

    window.addEventListener('resize', handleResize)
    const candlesPane = chart.panes()[1]
    candlesPane.setHeight(100)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (chartRef.current) {
        chartRef.current.remove()
        chartRef.current = null
        seriesRef.current = null
        volumeSeriesRef.current = null
      }
    }
  }, [])

  const updateCandle = useCallback((data: CustomCandleData) => {
    if (!data || typeof data.time === 'undefined') {
      console.error('Invalid data passed to updateCandle:', data)
      return
    }
    if (!seriesRef.current || !volumeSeriesRef.current) {
      console.log('Chart or series not initialized')
      return
    }
    seriesRef.current.update({
      time: data.time,
      open: data.open,
      high: data.high,
      low: data.low,
      close: data.close,
    } as CandlestickData)
    volumeSeriesRef.current.update({
      time: data.time,
      value: data.volume,
      color: data.close >= data.open ? '#0ecb81' : '#f6465d',
    })
  }, [])

  return {
    chartContainerRef,
    chartRef,
    seriesRef,
    volumeSeriesRef,
    updateCandle,
  }
}
