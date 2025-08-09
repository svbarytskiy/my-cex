import { createSlice } from '@reduxjs/toolkit'

interface BalanceState {
  usd: number
  btc: number
}

const initialState: BalanceState = {
  usd: 10000,
  btc: 0,
}

export const balanceSlice = createSlice({
  name: 'balance',
  initialState,
  reducers: {
    deposit: (state, action) => {
      state.usd += action.payload
    },
    withdraw: (state, action) => {
      state.usd -= action.payload
    },
  },
})

export const { deposit, withdraw } = balanceSlice.actions
export default balanceSlice.reducer
