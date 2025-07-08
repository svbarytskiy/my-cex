import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { fetchExchangeInfo } from './exchangeInfoThunks'
import { ExchangeInfoResponse } from './types'

interface ExchangeInfoState {
  data: ExchangeInfoResponse | null
  isLoading: boolean
  error: string | null
}

const initialState: ExchangeInfoState = {
  data: null,
  isLoading: false,
  error: null,
}

const exchangeInfoSlice = createSlice({
  name: 'exchangeInfo',
  initialState,
  reducers: {
    clearExchangeInfo: state => {
      state.data = null
      state.error = null
      state.isLoading = false
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchExchangeInfo.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(
        fetchExchangeInfo.fulfilled,
        (state, action: PayloadAction<ExchangeInfoResponse>) => {
          state.isLoading = false
          state.data = action.payload
        },
      )
      .addCase(fetchExchangeInfo.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || 'Unknown error'
      })
  },
})

export const { clearExchangeInfo } = exchangeInfoSlice.actions

export default exchangeInfoSlice.reducer
