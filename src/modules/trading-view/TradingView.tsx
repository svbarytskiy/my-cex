import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { CandleStickChart } from "./components/CandleStickChart/CandleStickChart";
import { ChartHeader } from "./components/ChartHeader/ChartHeader";
import { Toolbar } from "./components/Toolbar/Toolbar";
import { KlineInterval } from "../../binance/types/kline";
import { RootState, useAppDispatch } from "../../store/store";
import { clearEntry } from "../../store/slices/candles/candlesSlice";
import { fetchCandles, subscribeWS, unsubscribeWS } from "../../store/slices/candles/candlesThunks";

const TradingView: React.FC = () => {
    const dispatch = useAppDispatch();
    const [view, setView] = useState<"standard" | "tradingview" | "depth">("tradingview");
    const [activeInterval, setActiveInterval] = useState<KlineInterval>("1m");

    const symbol = "BTCUSDT";
    const key = `${symbol}_${activeInterval}`;
    //add delay to change interval
    const changeInterval = (interval: KlineInterval) => {
        if (activeInterval !== interval) {
            // dispatch(unsubscribeWS({ symbol, interval: activeInterval }))
            setActiveInterval(interval);
        }
    }

    const candlesEntry = useSelector((state: RootState) => state.candles.entries[key]);
    const loading = useSelector((state: RootState) => state.candles.loading);
    const error = useSelector((state: RootState) => state.candles.error);
    const streamingData = useSelector((state: RootState) => state.candles.streamingData[key]);
    useEffect(() => {
        const key = `${symbol}_${activeInterval}`;
        dispatch(fetchCandles({ symbol, interval: activeInterval }));
        dispatch(subscribeWS({ symbol, interval: activeInterval }));

        return () => {
            dispatch(clearEntry(key));
            dispatch(unsubscribeWS({ symbol, interval: activeInterval }))
        };
    }, [symbol, activeInterval]);

    const candles = candlesEntry?.candles || [];

    return (
        <>
            <ChartHeader
                activeView={view}
                onViewChange={(newView) => setView(newView)}
            />
            <div className="chart__wrapper">
                <Toolbar
                    activeInterval={activeInterval}
                    onIntervalChange={changeInterval}
                />
                {loading && <div>Завантаження...</div>}
                {error && <div className="text-red-500">Помилка: {error}</div>}
                {!loading && !error && candles.length > 0 && (
                    <CandleStickChart candles={candles} streamingData={streamingData} />)}
            </div>
        </>
    );
};

export { TradingView };
