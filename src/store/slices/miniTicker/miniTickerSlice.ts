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
      console.log('lababu', action.payload.data)
      const updates = Array.isArray(action.payload.data)
        ? action.payload.data
        : [action.payload.data]
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
})
export const { updateMiniTicker, setLoading, setError, setWsConnected } =
  miniTickerSlice.actions
export default miniTickerSlice.reducer
