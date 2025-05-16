import { persistReducer } from 'redux-persist';
import { IndexedDBStorage } from 'redux-persist-indexeddb-storage';
import { rootReducer } from './rootReducer';

declare module 'redux-persist' {
  interface PersistConfig {
    serializableCheck?: boolean;
  }
}

export const persistConfig = {
  key: 'binance-clone',
  storage: new IndexedDBStorage('TradingDB', {
    storeName: 'settings',
    keyPath: 'id',
    indexes: [
      { name: 'bySymbol', keyPath: 'symbol' },
      { name: 'byTime', keyPath: 'time' }
    ],
  }),
  whitelist: ['historical'],
  serialize: false,
  timeout: 10000,
};

export const persistedReducer = persistReducer(persistConfig, rootReducer);