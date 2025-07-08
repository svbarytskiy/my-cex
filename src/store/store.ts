import { configureStore } from '@reduxjs/toolkit'
import balanceReducer from './slices/balanceSlice'
import candlesReducer from './slices/candles/candlesSlice'
import orderBookReducer from './slices/orderBook/orderBookSlice'
import tickerReducer from './slices/ticker/tickerSlice'
import miniTickerReducer from './slices/miniTicker/miniTickerSlice'
import exchangeInfoReducer from './slices/exchangeInfo/exchangeInfoSlice'
import lastTradesReducer from './slices/lastTrades/lastTradesSlice'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

export const store = configureStore({
  reducer: {
    balance: balanceReducer,
    candles: candlesReducer,
    orderBook: orderBookReducer,
    ticker: tickerReducer,
    exchangeInfo: exchangeInfoReducer,
    lastTrades: lastTradesReducer,
    miniTicker: miniTickerReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
