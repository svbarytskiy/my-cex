import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchOrderBook, subscribeOrderBookWS, unsubscribeOrderBookWS } from "./orderBookThunks";
import { OrderBook } from "./types";

export interface OrderBookState {
    symbol?: string;
    lastUpdateId: number;
    bids: [string, string][];
    asks: [string, string][];
    bufferedEvents: OrderBook[];
    isInitialized: boolean;
    loading: boolean;
    error: string | null;
    wsConnected: boolean;
}
const initialState: OrderBookState = {
    symbol: undefined,
    lastUpdateId: 0,
    bufferedEvents: [],
    bids: [],
    asks: [],
    isInitialized: false,
    loading: false,
    error: null,
    wsConnected: false,
}

const orderBookSlice = createSlice({
    name: "orderBook",
    initialState,
    reducers: {
        wsOrderBookUpdate: (state, action: PayloadAction<{ key: string, data: OrderBook }>) => {
            const { data } = action.payload;
            if (!state.isInitialized) {
                state.bufferedEvents.push(data);
            } else {
                processUpdate(state, data);
            }

        },
        setWsConnected: (state, action: PayloadAction<boolean>) => {
            state.wsConnected = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrderBook.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrderBook.fulfilled, (state, action) => {
                const { lastUpdateId, bids, asks } = action.payload;

                // Перевірка синхронізації з буферизованими подіями
                const firstEvent = state.bufferedEvents[0];
                if (firstEvent && firstEvent.firstUpdateId > lastUpdateId) {
                    state.loading = false;
                    state.error = "Snapshot is outdated, retrying...";
                    return;
                }

                // Фільтрація буферизованих подій
                state.bufferedEvents = state.bufferedEvents.filter(
                    event => event.lastUpdateId > lastUpdateId
                );

                // Оновлення стану
                state.lastUpdateId = lastUpdateId;
                state.bids = bids;
                state.asks = asks;
                state.isInitialized = true;
                state.loading = false;

                // Обробка буферизованих подій
                state.bufferedEvents.forEach(event => processUpdate(state, event));
                state.bufferedEvents = [];
            })
            .addCase(fetchOrderBook.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch order book";
            })
            .addCase(subscribeOrderBookWS.fulfilled, (state) => {
                state.wsConnected = true;
            })
            .addCase(unsubscribeOrderBookWS.fulfilled, (state) => {
                state.wsConnected = false;
            });
    },
})

function processUpdate(state: OrderBookState, event: OrderBook) {
    if (event.lastUpdateId <= state.lastUpdateId) return;

    if (event.firstUpdateId > state.lastUpdateId + 1) {
        state.error = "Data gap detected! Reinitializing...";
        state.isInitialized = false;
        return;
    }

    // Оновлення bids
    event.bids.forEach(([price, quantity]) => {
        updateBookSide(state.bids, price, quantity);
    });

    // Оновлення asks
    event.asks.forEach(([price, quantity]) => {
        updateBookSide(state.asks, price, quantity);
    });

    state.lastUpdateId = event.lastUpdateId;
}

function updateBookSide(side: [string, string][], price: string, quantity: string) {
    const index = side.findIndex(([p]) => p === price);
    if (quantity === "0") {
        if (index !== -1) side.splice(index, 1);
    } else {
        if (index !== -1) {
            side[index][1] = quantity;
        } else {
            side.push([price, quantity]);
        }
    }
    // Сортування після оновлення
    side.sort((a, b) => parseFloat(b[0]) - parseFloat(a[0])); // Для bids
}

export const { wsOrderBookUpdate } = orderBookSlice.actions;
export default orderBookSlice.reducer;