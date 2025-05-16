import { CandlestickData, HistogramData } from 'lightweight-charts';
import { KlineMessage } from '../types/kline';


export const adaptKlineToChart = (
  message: KlineMessage
): [CandlestickData, HistogramData] => {
  const { k: data } = message;
  
  const candle: CandlestickData = {
    time: data.t / 1000,
    open: parseFloat(data.o),
    high: parseFloat(data.h),
    low: parseFloat(data.l),
    close: parseFloat(data.c),
  };

  const volume: HistogramData = {
    time: data.t / 1000,
    value: parseFloat(data.v),
    color: parseFloat(data.c) >= parseFloat(data.o) 
      ? 'rgba(77, 189, 116, 0.5)'
      : 'rgba(248, 108, 107, 0.5)',
  };

  return [candle, volume];
};