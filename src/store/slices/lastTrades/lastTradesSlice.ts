import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import Trade from './types'
import { fetchInitialTrades } from './lastTradesThunks'

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
      console.log('addNewTrade', action.payload)
      const updatedTrades = [action.payload, ...state.trades]
      state.trades = updatedTrades.slice(0, MAX_TRADES)
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchInitialTrades.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchInitialTrades.fulfilled, (state, action) => {
        state.loading = false
        state.trades = action.payload.slice(0, MAX_TRADES)
      })
      .addCase(fetchInitialTrades.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { addNewTrade } = tradesSlice.actions

export default tradesSlice.reducer
