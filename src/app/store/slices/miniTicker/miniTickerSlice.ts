import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { MiniTicker } from './types'
import { fetchInitialMiniTickers } from './miniTickerThunk'

interface MiniTickerState {
  miniTickers: Record<string, MiniTicker>
  loading: boolean
  wsConnected: boolean
  error: string | null
}

const initialState: MiniTickerState = {
  miniTickers: {},
  loading: false,
  error: null,
  wsConnected: false,
}

const miniTickerSlice = createSlice({
  name: 'miniTicker',
  initialState,
  reducers: {
    updateMiniTicker(state, action: PayloadAction<MiniTicker | MiniTicker[]>) {
      const updates = Array.isArray(action.payload)
        ? action.payload
        : [action.payload]
      for (const item of updates) {
        state.miniTickers[item.symbol] = item
      }
    },

    setLoading(state, action: { payload: boolean }) {
      state.loading = action.payload
    },
    setError(state, action: { payload: string | null }) {
      state.error = action.payload
    },
    setWsConnected: (state, action: PayloadAction<boolean>) => {
      state.wsConnected = action.payload
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchInitialMiniTickers.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(
        fetchInitialMiniTickers.fulfilled,
        (state, action: PayloadAction<MiniTicker[]>) => {
          state.loading = false
          state.error = null
          action.payload.forEach(ticker => {
            state.miniTickers[ticker.symbol] = ticker
          })
        },
      )
      .addCase(fetchInitialMiniTickers.rejected, (state, action) => {
        state.loading = false
      })
  },
  selectors: {
    selectMiniTickers: (state: MiniTickerState) => state.miniTickers,
    selectMiniTickersLoading: (state: MiniTickerState) => state.loading,
    selectWsConnected: (state: MiniTickerState) => state.wsConnected,
    selectMiniTickersError: (state: MiniTickerState) => state.error,
  },
})
export const { updateMiniTicker, setLoading, setError, setWsConnected } =
  miniTickerSlice.actions
export const {
  selectMiniTickers,
  selectMiniTickersLoading,
  selectWsConnected,
  selectMiniTickersError,
} = miniTickerSlice.selectors

export default miniTickerSlice.reducer
