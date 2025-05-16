// core/ws/streamRegistry.ts
import { store } from '../../store/store';
// import { wsTickerUpdate } from '@/features/ticker/tickerSlice';
// import { wsOrderBookUpdate } from '@/features/orderBook/orderBookSlice';
import { wsCandleUpdate } from '../../store/slices/candles/candlesSlice';
import { Candle } from '../../store/slices/candles/types';
import { wsOrderBookUpdate } from '../../store/slices/orderBook/orderBookSlice';
import { OrderBook } from '../../store/slices/orderBook/types';
import { wsTickerUpdate } from '../../store/slices/ticker/tickerSlice';
import Ticker from '../../store/slices/ticker/types';

export interface StreamHandler<T> {
    key: (symbol: string, interval?: string) => string;
    parseMessage: (msg: any) => T | null;
    reducerAction: (payload: { key: string, data: T }) => any;
}

export const streamRegistry = {
    kline: {
        key: (symbol: string, interval?: string) => `${symbol.toUpperCase()}_${interval}`,
        parseMessage: (msg): Candle | null => {
            if (!msg.k) return null;
            return {
                time: msg.k.t,
                open: +msg.k.o,
                high: +msg.k.h,
                low: +msg.k.l,
                close: +msg.k.c,
                volume: +msg.k.v,
            };
        },
        reducerAction: ({ key, data }: { key: string; data: Candle }) =>
            wsCandleUpdate({ key, data }),
    } as StreamHandler<Candle>,

    ticker: {
        key: (symbol: string) => symbol.toUpperCase(),
        parseMessage: (msg): Ticker | null => {
            if (!msg.c) return null;
            return {
                price: msg.c,
                high: msg.h,
                low: msg.l,
                percentChange: msg.P + '%',
                volume: msg.v,
                quoteVolume: msg.q,
            };
        },
        reducerAction: ({ key, data }: { key: string; data: Ticker }) => wsTickerUpdate({ key, data }),
    } as StreamHandler<Ticker>,

    depth: {
        key: (symbol: string) => symbol.toUpperCase(),
        parseMessage: (msg): OrderBook | null => {
            if (!msg.b || !msg.a) return null;
            return {
                lastUpdateId: msg.u,
                firstUpdateId: msg.U,
                bids: msg.b,
                asks: msg.a,
            };
        },
        reducerAction: ({ key, data }: { key: string; data: OrderBook }) => wsOrderBookUpdate({ key, data }),
    } as StreamHandler<OrderBook>,
};

// Global stream dispatcher
export function registerStream<T>(
    type: keyof typeof streamRegistry,
    symbol: string,
    params?: { interval?: string, delay?: string }
) {
    const lowerSymbol = symbol.toLowerCase();

    let streamName: string;

    if (type === 'kline' && params?.interval) {
        streamName = `${lowerSymbol}@kline_${params.interval}`;
    } else if (type === 'depth' && params?.delay) {
        streamName = `${lowerSymbol}@${type}@${params.delay}`;
    } else {
        streamName = `${lowerSymbol}@${type}`;
    }

    const handler = streamRegistry[type];
    const key = handler.key(symbol, params?.interval);
    console.log("Key ", key)
    console.log("streamName ", streamName)
    return {
        stream: streamName,
        onMessage: (data: any) => {
            const parsed = handler.parseMessage(data);
            if (parsed) {
                store.dispatch(handler.reducerAction({ key, data: parsed }));
            }
        },
    };
}

