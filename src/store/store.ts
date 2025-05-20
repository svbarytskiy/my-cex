import { configureStore } from '@reduxjs/toolkit';
import balanceReducer from './slices/balanceSlice';
import candlesReducer from './slices/candles/candlesSlice';
import orderBookReducer from './slices/orderBook/orderBookSlice';
import tickerReducer from './slices/ticker/tickerSlice';
import exchangeInfoReducer from './slices/exchangeInfo/exchangeInfoSlice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';


export const store = configureStore({
  reducer: {
    balance: balanceReducer,
    candles: candlesReducer,
    orderBook: orderBookReducer,
    ticker: tickerReducer,
    exchangeInfo: exchangeInfoReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;