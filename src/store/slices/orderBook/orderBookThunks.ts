import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import {
    OrderBook,
    FetchOrderBookResponse,
    FetchOrderBookParams,
} from "./types";
// import { markWsSubscribed } from "./orderBookSlice";
import axiosInstance from "../../../http/axios";
import { wsTradeClient } from "../../../core/ws/WebSocketClient";
import { registerStream } from "../../../core/ws/streamRegistry";

export const fetchOrderBook = createAsyncThunk<
    FetchOrderBookResponse,
    FetchOrderBookParams
>("orderbook/fetch", async ({ symbol }) => {
    const { data } = await axiosInstance.get(`/depth`, {
        params: { symbol: symbol.toUpperCase(), limit: 100 },
    });

    return {
        key: symbol.toUpperCase(),
        lastUpdateId: data.lastUpdateId,
        bids: data.bids,
        asks: data.asks,
    };
});


// export const initializeOrderBook = createAsyncThunk<
//     void,
//     string,
//     { state: RootState }
// >("orderBook/initialize", async (symbol, { dispatch }) => {
//     try {
//          // Підключаємося до WebSocket
//         await dispatch(subscribeOrderBookWS(symbol));
//         // Спочатку отримуємо снепшот
//         await dispatch(fetchOrderBook(symbol)).unwrap();



//     } catch (error) {
//         console.error("Initialization failed:", error);
//         throw error;
//     }
// });

export const subscribeOrderBookWS = createAsyncThunk<
    void,
    string,
    { state: RootState }
>("orderbook/subscribe", async (symbol, { dispatch }) => {
    const { stream, onMessage } = registerStream<'depth'>("depth", symbol, { delay: '1000ms' });
    wsTradeClient.subscribe(stream, onMessage);
});


export const unsubscribeOrderBookWS = createAsyncThunk(
    "orderbook/unsubscribe",
    async (symbol: string) => {
        const stream = `${symbol.toLowerCase()}@depth`;
        wsTradeClient.unsubscribe(stream);
    }
);