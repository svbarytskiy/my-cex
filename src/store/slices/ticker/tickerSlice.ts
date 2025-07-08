import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import Ticker from './types'

export interface TickerState extends Ticker {
  symbol?: string
  error: string | null
  wsConnected: boolean
}
const initialState: TickerState = {
  error: null,
  wsConnected: false,
  price: '0',
  high: '0',
  low: '0',
  percentChange: '0',
  volume: '0',
  quoteVolume: '0',
  quoteChange: '0',
}

const tickerSlice = createSlice({
  name: 'ticker',
  initialState,
  reducers: {
    wsTickerUpdate: (
      state,
      action: PayloadAction<{ key: string; data: Ticker }>,
    ) => {
      const {
        price,
        high,
        low,
        percentChange,
        volume,
        quoteVolume,
        quoteChange,
      } = action.payload.data
      state.symbol = action.payload.key
      state.price = price
      state.high = high
      state.low = low
      state.percentChange = percentChange
      state.volume = volume
      state.quoteVolume = quoteVolume
      state.quoteChange = quoteChange
    },
    setWsConnected: (state, action: PayloadAction<boolean>) => {
      state.wsConnected = action.payload
    },
  },
})

export const { wsTickerUpdate, setWsConnected } = tickerSlice.actions
export default tickerSlice.reducer
