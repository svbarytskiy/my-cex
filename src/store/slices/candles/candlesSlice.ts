import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CandlesState, Candle } from "./types";
import { fetchCandles } from "./candlesThunks";

const TTL = 5 * 60 * 1000;

const initialState: CandlesState = {
  entries: {},
  streamingData: {},
  loading: false,
  error: null,
};

const candlesSlice = createSlice({
  name: "candles",
  initialState,
  reducers: {
    wsCandleUpdate: (state, action: PayloadAction<{ key: string; data: Candle }>) => {
      const { key, data } = action.payload;
      state.streamingData[key] = data;
    },
    markWsSubscribed: (state, action: PayloadAction<string>) => {
      const entry = state.entries[action.payload];
      if (entry) entry.wsSubscribed = true;
    },
    clearEntry: (state, action: PayloadAction<string>) => {
      delete state.entries[action.payload];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCandles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCandles.fulfilled, (state, action) => {
        const { key, candles } = action.payload;
        state.entries[key] = {
          candles,
          fetchedAt: Date.now(),
          wsSubscribed: false,
        };
        state.loading = false;
      })
      .addCase(fetchCandles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Fetch error";
      });
  },
});

export const { wsCandleUpdate, markWsSubscribed, clearEntry } = candlesSlice.actions;
export default candlesSlice.reducer;

// Селектор
import { RootState } from "../../store";
import { KlineInterval } from "../../../binance/types/kline";

export const selectCandles = (
  state: RootState,
  symbol: string,
  interval: KlineInterval
) => {
  const key = `${symbol}_${interval}`;
  const entry = state.candles.entries[key];
  if (!entry || Date.now() - entry.fetchedAt > TTL) return null;
  return entry.candles;
};
