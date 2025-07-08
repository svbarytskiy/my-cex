import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { OrderBookLevel } from './types'

export interface OrderBookState {
  symbol?: string
  lastUpdateId: number
  bidsArray: OrderBookLevel[]
  asksArray: OrderBookLevel[]
  loading: boolean
  error: string | null
  wsConnected: boolean
}

const initialState: OrderBookState = {
  symbol: undefined,
  lastUpdateId: 0,
  bidsArray: [],
  asksArray: [],
  loading: false,
  error: null,
  wsConnected: false,
}

const orderBookSlice = createSlice({
  name: 'orderBook',
  initialState,
  reducers: {
    updateOrderBook: (
      state,
      action: PayloadAction<{
        bids: OrderBookLevel[]
        asks: OrderBookLevel[]
        lastUpdateId: number
      }>,
    ) => {
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
  },
  extraReducers: builder => {
    builder
      .addCase('orderbook/fetch/pending', state => {
        state.loading = true
        state.error = null
      })
      .addCase('orderbook/fetch/fulfilled', state => {
        state.loading = false
      })
      .addCase('orderbook/fetch/rejected', (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Fetch failed'
      })
  },
})

export const { updateOrderBook, setWsConnected, setError } =
  orderBookSlice.actions
export default orderBookSlice.reducer
