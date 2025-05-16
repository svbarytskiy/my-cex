import { createChart, ISeriesApi, SeriesType, ColorType, CandlestickSeriesPartialOptions, CandlestickSeries, HistogramSeries } from "lightweight-charts";
import { useRef, useEffect, useCallback } from "react";
import { CustomCandleData } from "../components/CandleStickChart/CandleStickChart";

export const useCHartsSetup = (mockCandlestickData: CustomCandleData[]) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<ReturnType<typeof createChart> | null>(null);
    const seriesRef = useRef<ISeriesApi<SeriesType> | null>(null);
    const volumeSeriesRef = useRef<ISeriesApi<SeriesType> | null>(null);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: '#1e1e1e' },
                textColor: '#d1d4dc',
                panes: {
                    separatorColor: '#ffffff',
                    separatorHoverColor: '#485f7b',
                    enableResize: true,
                },
            },
            grid: {
                vertLines: { color: '#2B2B43' },
                horzLines: { color: '#363C4E' },
            },
            rightPriceScale: {
                borderColor: '#485c7b',
            },
            timeScale: {
                borderColor: '#485c7b',
                timeVisible: true,
                rightOffset: 15
            },
            width: chartContainerRef.current.clientWidth,
            height: 500,
        });

        const seriesOptions: CandlestickSeriesPartialOptions = {
            upColor: '#4dbd74',
            downColor: '#f86c6b',
            borderVisible: true,
            wickVisible: true,
            borderUpColor: '#4dbd74',
            borderDownColor: '#f86c6b',
            wickUpColor: '#4dbd74',
            wickDownColor: '#f86c6b',
        };
        const volumeSeries = chart.addSeries(HistogramSeries, { color: '#485c7b' }, 1);
        volumeSeries.setData(mockCandlestickData.map((item) => ({
            time: item.time,
            value: item.volume,
            color: item.close >= item.open ? '#4dbd74' : '#f86c6b',
        })));
        const candleSeries = chart.addSeries(CandlestickSeries, seriesOptions);
        candleSeries.setData(
            mockCandlestickData.map((item) => ({
                time: item.time,
                open: item.open,
                high: item.high,
                low: item.low,
                close: item.close,
            }))
        );
        chartRef.current = chart;
        volumeSeriesRef.current = volumeSeries;
        seriesRef.current = candleSeries;

        const handleResize = () => {
            if (chartContainerRef.current && chartRef.current) {
                chartRef.current.applyOptions({
                    width: chartContainerRef.current.clientWidth
                });
            }
        };

        window.addEventListener('resize', handleResize);
        const candlesPane = chart.panes()[1];
        candlesPane.setHeight(100);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (chartRef.current) {
                chartRef.current.remove();
                chartRef.current = null;
                seriesRef.current = null;
                volumeSeriesRef.current = null;
            }
        };
    }, []);

    const updateCandle = useCallback((data: CustomCandleData) => {
        console.log('Received data for update:', data); // Додайте цей рядок для діагностики
        if (!data || typeof data.time === 'undefined') { // Додаткова перевірка
            console.error('Invalid data passed to updateCandle:', data);
            return;
        }
        if (!seriesRef.current || !volumeSeriesRef.current) {
            console.log('Chart or series not initialized');
            return;
        }
        seriesRef.current.update({
            time: data.time,
            open: data.open,
            high: data.high,
            low: data.low,
            close: data.close
        });
        volumeSeriesRef.current.update({
            time: data.time,
            value: data.volume,
            color: data.close >= data.open ? '#4dbd74' : '#f86c6b',
        });

    }, []);

    return { chartContainerRef, chartRef, seriesRef, volumeSeriesRef, updateCandle }
}