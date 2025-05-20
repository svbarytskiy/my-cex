import { FC, useEffect } from "react";
import { CandlestickData, HistogramData } from "lightweight-charts";
import { useCHartsSetup } from "../../hooks/useChartsSetup";

const mockCandlestickData: CandlestickData[] = [
  { time: '2024-04-08', open: 100, high: 104, low: 95, close: 98 },
  { time: '2024-04-09', open: 98, high: 103, low: 92, close: 97 },
  { time: '2024-04-10', open: 97, high: 106, low: 95, close: 100 },
  { time: '2024-04-11', open: 100, high: 108, low: 97, close: 105 },
  { time: '2024-04-12', open: 105, high: 111, low: 102, close: 110 },
  { time: '2024-04-13', open: 110, high: 117, low: 107, close: 115 },
  { time: '2024-04-14', open: 115, high: 120, low: 112, close: 114 },
  { time: '2024-04-15', open: 114, high: 118, low: 109, close: 111 },
  { time: '2024-04-16', open: 111, high: 115, low: 108, close: 114 },
  { time: '2024-04-17', open: 114, high: 118, low: 113, close: 117 },
  { time: '2024-04-18', open: 117, high: 122, low: 116, close: 120 },
  { time: '2024-04-19', open: 120, high: 125, low: 119, close: 124 },
  { time: '2024-04-20', open: 124, high: 130, low: 123, close: 128 },
  { time: '2024-04-21', open: 128, high: 135, low: 125, close: 129 },
  { time: '2024-04-22', open: 129, high: 133, low: 126, close: 127 },
  { time: '2024-04-23', open: 127, high: 130, low: 122, close: 124 },
  { time: '2024-04-24', open: 124, high: 129, low: 121, close: 123 },
  { time: '2024-04-25', open: 123, high: 125, low: 118, close: 120 },
  { time: '2024-04-26', open: 120, high: 121, low: 115, close: 117 },
  { time: '2024-04-27', open: 117, high: 120, low: 113, close: 119 },
  { time: '2024-04-28', open: 119, high: 124, low: 117, close: 123 },
  { time: '2024-04-29', open: 123, high: 126, low: 121, close: 125 },
  { time: '2024-04-30', open: 125, high: 129, low: 122, close: 124 },
  { time: '2024-05-01', open: 124, high: 128, low: 120, close: 122 },
  { time: '2024-05-02', open: 122, high: 125, low: 118, close: 120 },
  { time: '2024-05-03', open: 120, high: 123, low: 117, close: 119 },
  { time: '2024-05-04', open: 119, high: 124, low: 116, close: 121 },
  { time: '2024-05-05', open: 121, high: 126, low: 119, close: 125 },
  { time: '2024-05-06', open: 125, high: 130, low: 123, close: 127 },
  { time: '2024-05-07', open: 127, high: 132, low: 125, close: 130 },
  { time: '2024-05-08', open: 130, high: 135, low: 128, close: 134 },
  { time: '2024-05-09', open: 134, high: 137, low: 130, close: 133 },
  { time: '2024-05-10', open: 133, high: 138, low: 129, close: 136 },
  { time: '2024-05-11', open: 136, high: 139, low: 132, close: 135 },
  { time: '2024-05-12', open: 135, high: 137, low: 131, close: 132 },
  { time: '2024-05-13', open: 132, high: 136, low: 129, close: 134 },
  { time: '2024-05-14', open: 134, high: 138, low: 130, close: 133 },
  { time: '2024-05-15', open: 133, high: 136, low: 128, close: 129 },
  { time: '2024-05-16', open: 129, high: 132, low: 125, close: 126 },
  { time: '2024-05-17', open: 126, high: 130, low: 123, close: 128 },
  { time: '2024-05-18', open: 128, high: 132, low: 126, close: 130 },
  { time: '2024-05-19', open: 130, high: 135, low: 128, close: 134 },
  { time: '2024-05-20', open: 134, high: 138, low: 132, close: 137 },
  { time: '2024-05-21', open: 137, high: 140, low: 135, close: 139 },
  { time: '2024-05-22', open: 139, high: 144, low: 137, close: 143 },
  { time: '2024-05-23', open: 143, high: 148, low: 140, close: 145 },
  { time: '2024-05-24', open: 145, high: 150, low: 142, close: 147 },
  { time: '2024-05-25', open: 147, high: 153, low: 144, close: 152 },
  { time: '2024-05-26', open: 152, high: 155, low: 149, close: 151 },
  { time: '2024-05-27', open: 151, high: 156, low: 147, close: 154 },
  { time: '2024-05-28', open: 154, high: 158, low: 151, close: 157 },
  { time: '2024-05-29', open: 157, high: 160, low: 155, close: 159 },
];

const mockVolumeData: HistogramData[] = [
  { time: '2024-04-08', value: 7000, color: 'rgba(248, 108, 107, 0.5)' },
  { time: '2024-04-09', value: 6800, color: 'rgba(248, 108, 107, 0.5)' },
  { time: '2024-04-10', value: 9000, color: 'rgba(77, 189, 116, 0.5)' },
  { time: '2024-04-11', value: 11000, color: 'rgba(77, 189, 116, 0.5)' },
  { time: '2024-04-12', value: 10500, color: 'rgba(77, 189, 116, 0.5)' },
  { time: '2024-04-13', value: 9700, color: 'rgba(248, 108, 107, 0.5)' },
  { time: '2024-04-14', value: 8900, color: 'rgba(248, 108, 107, 0.5)' },
  { time: '2024-04-15', value: 9200, color: 'rgba(77, 189, 116, 0.5)' },
  { time: '2024-04-16', value: 9900, color: 'rgba(77, 189, 116, 0.5)' },
  { time: '2024-04-17', value: 8800, color: 'rgba(77, 189, 116, 0.5)' },
  { time: '2024-04-18', value: 10300, color: 'rgba(77, 189, 116, 0.5)' },
  { time: '2024-04-19', value: 10800, color: 'rgba(77, 189, 116, 0.5)' },
  { time: '2024-04-20', value: 11500, color: 'rgba(77, 189, 116, 0.5)' },
  { time: '2024-04-21', value: 10700, color: 'rgba(248, 108, 107, 0.5)' },
  { time: '2024-04-22', value: 9600, color: 'rgba(248, 108, 107, 0.5)' },
  { time: '2024-04-23', value: 9500, color: 'rgba(248, 108, 107, 0.5)' },
  { time: '2024-04-24', value: 9700, color: 'rgba(248, 108, 107, 0.5)' },
  { time: '2024-04-25', value: 8800, color: 'rgba(248, 108, 107, 0.5)' },
  { time: '2024-04-26', value: 8600, color: 'rgba(248, 108, 107, 0.5)' },
  { time: '2024-04-27', value: 9100, color: 'rgba(77, 189, 116, 0.5)' },
  { time: '2024-04-28', value: 9900, color: 'rgba(77, 189, 116, 0.5)' },
  { time: '2024-04-29', value: 9700, color: 'rgba(77, 189, 116, 0.5)' },
  { time: '2024-04-30', value: 9400, color: 'rgba(248, 108, 107, 0.5)' },
  { time: '2024-05-01', value: 9100, color: 'rgba(248, 108, 107, 0.5)' },
  { time: '2024-05-02', value: 8700, color: 'rgba(248, 108, 107, 0.5)' },
  { time: '2024-05-03', value: 8800, color: 'rgba(248, 108, 107, 0.5)' },
  { time: '2024-05-04', value: 9300, color: 'rgba(77, 189, 116, 0.5)' },
  { time: '2024-05-05', value: 10200, color: 'rgba(77, 189, 116, 0.5)' },
  { time: '2024-05-06', value: 11100, color: 'rgba(77, 189, 116, 0.5)' },
  { time: '2024-05-07', value: 11300, color: 'rgba(77, 189, 116, 0.5)' },
  { time: '2024-05-08', value: 11700, color: 'rgba(77, 189, 116, 0.5)' },
  { time: '2024-05-09', value: 9900, color: 'rgba(248, 108, 107, 0.5)' },
  { time: '2024-05-10', value: 9800, color: 'rgba(77, 189, 116, 0.5)' },
  { time: '2024-05-11', value: 9500, color: 'rgba(248, 108, 107, 0.5)' },
  { time: '2024-05-12', value: 9100, color: 'rgba(248, 108, 107, 0.5)' },
  { time: '2024-05-13', value: 9400, color: 'rgba(77, 189, 116, 0.5)' },
  { time: '2024-05-14', value: 9200, color: 'rgba(248, 108, 107, 0.5)' },
  { time: '2024-05-15', value: 8900, color: 'rgba(248, 108, 107, 0.5)' },
  { time: '2024-05-16', value: 8700, color: 'rgba(248, 108, 107, 0.5)' },
  { time: '2024-05-17', value: 9300, color: 'rgba(77, 189, 116, 0.5)' },
  { time: '2024-05-18', value: 9400, color: 'rgba(77, 189, 116, 0.5)' },
  { time: '2024-05-19', value: 9700, color: 'rgba(77, 189, 116, 0.5)' },
  { time: '2024-05-20', value: 9800, color: 'rgba(77, 189, 116, 0.5)' },
  { time: '2024-05-21', value: 10200, color: 'rgba(77, 189, 116, 0.5)' },
  { time: '2024-05-22', value: 10400, color: 'rgba(77, 189, 116, 0.5)' },
  { time: '2024-05-23', value: 10700, color: 'rgba(77, 189, 116, 0.5)' },
  { time: '2024-05-24', value: 11000, color: 'rgba(77, 189, 116, 0.5)' },
  { time: '2024-05-25', value: 11300, color: 'rgba(77, 189, 116, 0.5)' },
  { time: '2024-05-26', value: 10900, color: 'rgba(248, 108, 107, 0.5)' },
  { time: '2024-05-27', value: 11500, color: 'rgba(77, 189, 116, 0.5)' },
  { time: '2024-05-28', value: 11700, color: 'rgba(77, 189, 116, 0.5)' },
  { time: '2024-05-29', value: 11900, color: 'rgba(77, 189, 116, 0.5)' },
];

interface CandleStickChartProps {
  candles: CustomCandleData[];
  streamingData: CustomCandleData;
}

// Оновлений тип для свічки (можна винести в окремий файл, наприклад `src/types/candle.ts`)
export interface CustomCandleData extends CandlestickData {
  volume: number; // Додаємо volume, якого немає в стандартному CandlestickData
}

const CandleStickChart: FC<CandleStickChartProps> = ({ candles, streamingData }) => {
  let { chartContainerRef, updateCandle } = useCHartsSetup(candles);

  useEffect(() => {
    updateCandle(streamingData)
  }, [streamingData]);

  return <div ref={chartContainerRef} style={{ width: '100%', height: '500px' }} />;
};

export { CandleStickChart };