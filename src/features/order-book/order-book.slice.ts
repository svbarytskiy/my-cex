import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface OrderBookState {
  isOrderRatioVisible: boolean
  totalColumnCurrency: 'base' | 'quote'
  totalColumnType: 'cumulative-sum' | 'level-amount'
}

const initialState: OrderBookState = {
  isOrderRatioVisible: true,
  totalColumnCurrency: 'quote',
  totalColumnType: 'cumulative-sum',
}

const OrderBookSlice = createSlice({
  name: 'orderBook',
  initialState,
  reducers: {
    toggleOrderRatioVisibility: (
      state,
      action: PayloadAction<boolean | undefined>,
    ) => {
      state.isOrderRatioVisible =
        action.payload !== undefined
          ? action.payload
          : !state.isOrderRatioVisible
    },
    setTotalColumnCurrency: (
      state,
      action: PayloadAction<'base' | 'quote'>,
    ) => {
      state.totalColumnCurrency = action.payload
    },
    setTotalColumnType: (
      state,
      action: PayloadAction<'cumulative-sum' | 'level-amount'>,
    ) => {
      state.totalColumnType = action.payload
    },
  },
  selectors: {
    selectOrderBook: (state: OrderBookState) => state,
    selectIsOrderRatioVisible: (state: OrderBookState) =>
      state.isOrderRatioVisible,
    selectTotalColumnCurrency: (state: OrderBookState) =>
      state.totalColumnCurrency,
    selectTotalColumnType: (state: OrderBookState) => state.totalColumnType,
  },
})

export const {
  toggleOrderRatioVisibility,
  setTotalColumnCurrency,
  setTotalColumnType,
} = OrderBookSlice.actions

export const {
  selectOrderBook,
  selectIsOrderRatioVisible,
  selectTotalColumnCurrency,
  selectTotalColumnType,
} = OrderBookSlice.selectors

export default OrderBookSlice.reducer
