import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { DepthLevel, ProcessedDepthData } from './types'
import { fetchDepth } from './depthThunks'

export interface DepthState {
  symbol?: string
  lastUpdateId: number
  bidsArray: DepthLevel[]
  asksArray: DepthLevel[]
  loading: boolean
  error: string | null
  wsConnected: boolean
}

const initialState: DepthState = {
  symbol: undefined,
  lastUpdateId: 0,
  bidsArray: [],
  asksArray: [],
  loading: false,
  error: null,
  wsConnected: false,
}

const depthSlice = createSlice({
  name: 'depth',
  initialState,
  reducers: {
    setDepthData: (state, action: PayloadAction<ProcessedDepthData>) => {
      state.bidsArray = action.payload.bids
      state.asksArray = action.payload.asks
      state.lastUpdateId = action.payload.lastUpdateId
    },
    setWsConnected: (state, action: PayloadAction<boolean>) => {
      state.wsConnected = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    resetDepthState: state => {
      state.lastUpdateId = 0
      state.bidsArray = []
      state.asksArray = []
      state.symbol = undefined
      state.loading = false
      state.error = null
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setSymbol: (state, action: PayloadAction<string>) => {
      state.symbol = action.payload
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchDepth.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchDepth.fulfilled, (state, action) => {
        state.loading = false
        state.bidsArray = action.payload.bids
        state.asksArray = action.payload.asks
        state.lastUpdateId = action.payload.lastUpdateId
      })
      .addCase(fetchDepth.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch depth'
      })
  },
  selectors: {
    selectBidsArray: state => state.bidsArray,
    selectAsksArray: state => state.asksArray,
    selectDepthLoading: state => state.loading,
    selectDepthError: state => state.error,
    selectWsConnectionStatus: state => state.wsConnected,
    selectCurrentSymbol: state => state.symbol,
  },
})
export const {
  selectBidsArray,
  selectAsksArray,
  selectDepthLoading,
  selectDepthError,
  selectWsConnectionStatus,
  selectCurrentSymbol,
} = depthSlice.selectors
export const {
  setDepthData,
  setWsConnected,
  setError,
  resetDepthState,
  setLoading,
  setSymbol,
} = depthSlice.actions
export default depthSlice.reducer
