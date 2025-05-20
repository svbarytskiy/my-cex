import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../http/axios';
import { RootState, store } from '../../store';
import { wsTradeClient } from '../../../core/ws/WebSocketClient';
import { registerStream } from '../../../core/ws/streamRegistry';
import {
    updateOrderBook,
    setWsConnected,
    setError,
} from './orderBookSlice';
import type { SnapshotPayload, DepthEvent } from './types';

// Ініціалізація воркера
const worker = new Worker(
    new URL('../../../workers/orderbook.worker.ts', import.meta.url),
    { type: 'module' }
);

// Обробка повідомлень від воркера
worker.onmessage = ({ data }) => {
    if (data.type === 'UPDATE') {
        store.dispatch(updateOrderBook(data.payload));
    } else if (data.type === 'RESYNC') {
        // автоматичний ресинк
        if (currentSymbol) {
            store.dispatch(fetchOrderBook({ symbol: currentSymbol }));
        }
    }
};

let currentSymbol: string | null = null;

export const fetchOrderBook = createAsyncThunk<
    SnapshotPayload & { symbol: string },
    { symbol: string },
    { state: RootState }
>(
    'orderbook/fetch',
    async ({ symbol }, { dispatch }) => {
        currentSymbol = symbol.toUpperCase();
        const { data } = await axiosInstance.get('/depth', {
            params: { symbol: currentSymbol, limit: 1000 },
        });
        const payload: SnapshotPayload = {
            lastUpdateId: data.lastUpdateId,
            bids: data.bids,
            asks: data.asks,
        };
        // шлемо snapshot у воркер
        worker.postMessage({ type: 'SNAPSHOT', payload });
        return { ...payload, symbol: currentSymbol };
    }
);

export const subscribeOrderBookWS = createAsyncThunk<void, string>(
    'orderbook/subscribe',
    async (symbol, { dispatch }) => {
        dispatch(setWsConnected(true));
        currentSymbol = symbol.toUpperCase();

        const streamName = `${symbol.toLowerCase()}@depth@1000ms`;
        wsTradeClient.subscribe(streamName, (msg: any) => {
            // ручний парсинг
            if (msg.e === 'depthUpdate' && msg.b && msg.a) {
                const event: DepthEvent = {
                    U: msg.U,
                    u: msg.u,
                    b: msg.b,
                    a: msg.a,
                };
                worker.postMessage({ type: 'WS_EVENT', payload: event });
            }
        });
    }
);

export const unsubscribeOrderBookWS = createAsyncThunk<void, string>(
    'orderbook/unsubscribe',
    async (symbol) => {
        const stream = `${symbol.toLowerCase()}@depth@1000ms`;
        wsTradeClient.unsubscribe(stream);
        store.dispatch(setWsConnected(false));
    }
);
