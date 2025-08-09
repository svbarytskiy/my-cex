import { configureStore, combineReducers, Reducer } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import localforage from 'localforage'
import balanceReducer from './slices/balanceSlice'
import candlesReducer from './slices/candles/candlesSlice'
import depthReducer from './slices/depth/depthSlice.ts'
import tickerReducer from './slices/ticker/tickerSlice'
import miniTickerReducer from './slices/miniTicker/miniTickerSlice'
import exchangeInfoReducer from './slices/exchangeInfo/exchangeInfoSlice'
import lastTradesReducer from './slices/lastTrades/lastTradesSlice'
import uiSettingsReducer from './slices/uiSettings/uiSettings.slice.ts'
import pairSettingsReducer from './slices/pairSettings/pairSettings.slice.ts'
import tickerWatchlistReducer from 'features/tickers-watchlist/ticker-watchlist.slice'
import OrderBookReducer from 'features/order-book/order-book.slice'

const uiSettingsStorage = localforage.createInstance({
  name: 'tradingAppUIStore',
  storeName: 'uiSettings',
  driver: localforage.LOCALSTORAGE,
})

const pairSettingsStorage = localforage.createInstance({
  name: 'tradingAppPairData',
  storeName: 'pairSettings',
  driver: localforage.INDEXEDDB,
})

const OrderBookStorage = localforage.createInstance({
  name: 'tradingAppOrderBook',
  storeName: 'orderBookState',
  driver: localforage.LOCALSTORAGE,
})

const tickerWatchlistStorage = localforage.createInstance({
  name: 'tradingAppTickerWatchlist',
  storeName: 'watchlistState',
  driver: localforage.LOCALSTORAGE,
})

const uiSettingsPersistConfig = {
  key: 'uiSettings',
  storage: uiSettingsStorage,
}

const pairSettingsPersistConfig = {
  key: 'pairSettings',
  storage: pairSettingsStorage,
}

const tickerWatchlistPersistConfig = {
  key: 'tickerWatchlist',
  storage: tickerWatchlistStorage,
  whitelist: ['tab', 'sortColumn', 'sortDirection'],
}

const OrderBookPersistConfig = {
  key: 'OrderBook',
  storage: OrderBookStorage,
}

const staticReducers = {
  balance: balanceReducer,
  candles: candlesReducer,
  depth: depthReducer,
  ticker: tickerReducer,
  exchangeInfo: exchangeInfoReducer,
  lastTrades: lastTradesReducer,
  miniTicker: miniTickerReducer,
  uiSettings: persistReducer(uiSettingsPersistConfig, uiSettingsReducer),
  pairSettings: persistReducer(pairSettingsPersistConfig, pairSettingsReducer),
  tickerWatchlist: persistReducer(
    tickerWatchlistPersistConfig,
    tickerWatchlistReducer,
  ),
  orderBook: persistReducer(
    OrderBookPersistConfig,
    OrderBookReducer,
  ),
}

const asyncReducers: Record<string, Reducer> = {}

const createRootReducer = () => {
  return combineReducers({
    ...staticReducers,
    ...asyncReducers,
  })
}

export const store = configureStore({
  reducer: createRootReducer() as Reducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  // devTools: process.env.NODE_ENV !== 'production',
})

interface InjectReducerOptions {
  isPersisted?: boolean
  persistConfig?: {
    key: string
    storage: any
    whitelist?: string[]
    blacklist?: string[]
  }
}

export const injectReducer = (
  key: string,
  reducer: Reducer,
  options?: InjectReducerOptions,
) => {
  if (asyncReducers[key]) {
    console.warn(
      `Reducer with key '${key}' is already injected. Skipping injection.`,
    )
    return
  }

  let finalReducer = reducer
  if (options?.isPersisted) {
    if (!options.persistConfig) {
      console.error(
        `Error: persistConfig is required for persisted reducer '${key}'.`,
      )
      return
    }
    const modulePersistConfig = { ...options.persistConfig, key: key }
    finalReducer = persistReducer(modulePersistConfig, reducer)
  }

  asyncReducers[key] = finalReducer
  store.replaceReducer(createRootReducer())
}

export const removeReducer = (key: string) => {
  if (!asyncReducers[key]) {
    console.warn(`Reducer with key '${key}' is not injected. Skipping removal.`)
    return
  }
  delete asyncReducers[key]
  store.replaceReducer(createRootReducer())
}

export const persistor = persistStore(store)
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

declare module './store' {
  interface RootState {
    balance: ReturnType<typeof balanceReducer>
    candles: ReturnType<typeof candlesReducer>
    depth: ReturnType<typeof depthReducer>
    ticker: ReturnType<typeof tickerReducer>
    exchangeInfo: ReturnType<typeof exchangeInfoReducer>
    lastTrades: ReturnType<typeof lastTradesReducer>
    miniTicker: ReturnType<typeof miniTickerReducer>
    uiSettings: ReturnType<typeof uiSettingsReducer>
    pairSettings: ReturnType<typeof pairSettingsReducer>
    tickerWatchlist: ReturnType<typeof tickerWatchlistReducer>
    orderBook: ReturnType<typeof OrderBookReducer>
    // analytics?: AnalyticsState;
  }
}
