import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import Trade from './types'

interface TradesState {
  trades: Trade[]
  loading: boolean
  error: string | null
}

const initialState: TradesState = {
  trades: [],
  loading: false,
  error: null,
}

const MAX_TRADES = 50

const tradesSlice = createSlice({
  name: 'trades',
  initialState,
  reducers: {
    addNewTrade(state, action: PayloadAction<Trade>) {
      const updatedTrades = [action.payload, ...state.trades]
      state.trades = updatedTrades.slice(0, MAX_TRADES)
    },
  },
  //types error
  extraReducers: builder => {
    builder
      .addCase('trades/fetchInitialTrades/pending', state => {
        state.loading = true
        state.error = null
      })
      .addCase('trades/fetchInitialTrades/fulfilled', (state, action: any) => {
        state.loading = false
        state.trades = action.payload
      })
      .addCase('trades/fetchInitialTrades/rejected', (state, action: any) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { addNewTrade } = tradesSlice.actions

export default tradesSlice.reducer
