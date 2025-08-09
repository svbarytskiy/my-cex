import { wsCandleUpdate } from 'app/store/slices/candles/candlesSlice'
import { Candle } from 'app/store/slices/candles/types'
import { Depth } from 'app/store/slices/depth/types'

import Trade from 'app/store/slices/lastTrades/types'
import { addNewTrade } from 'app/store/slices/lastTrades/lastTradesSlice'
import {
  MiniTicker,
  MiniTickerResponse,
} from 'app/store/slices/miniTicker/types'
import { updateMiniTicker } from 'app/store/slices/miniTicker/miniTickerSlice'
import { Time } from 'lightweight-charts'
import { wsTickerUpdate } from 'app/store/slices/ticker/tickerSlice'
import Ticker from 'app/store/slices/ticker/types'
import { store } from 'app/store/store'

export interface RawMiniTickerItem {
  e: string
  E: number
  s: string
  c: string
  o: string
  h: string
  l: string
  v: string
  q: string
}

export interface StreamHandler<T> {
  key: (symbol?: string, interval?: string) => string
  parseMessage: (msg: any) => T | null
  reducerAction: (payload: { key: string; data: T }) => any
}

type StreamMap = {
  kline: Candle
  ticker: Ticker
  depth: Depth
  aggTrade: Trade
  miniTicker: MiniTicker[]
}

export const streamRegistry: {
  [K in keyof StreamMap]: StreamHandler<StreamMap[K]>
} = {
  kline: {
    key: (symbol?: string, interval?: string) =>
      symbol
        ? `${symbol.toUpperCase()}_${interval ?? ''}`
        : `${interval ?? ''}`,
    parseMessage: (msg): Candle | null => {
      if (!msg.k) return null
      return {
        time: Math.floor(msg.k.t / 1000) as Time,
        open: +msg.k.o,
        high: +msg.k.h,
        low: +msg.k.l,
        close: +msg.k.c,
        volume: +msg.k.v,
      }
    },
    reducerAction: ({ key, data }: { key: string; data: Candle }) =>
      wsCandleUpdate({ key, data }),
  },

  ticker: {
    key: (symbol?: string) =>
      symbol ? symbol.toUpperCase() : 'UNKNOWN_TICKER',
    parseMessage: (msg): Ticker | null => {
      if (!msg.c) return null
      return {
        price: msg.c,
        high: msg.h,
        low: msg.l,
        percentChange: msg.P + '%',
        quoteChange: msg.p,
        volume: msg.v,
        quoteVolume: msg.q,
      }
    },
    reducerAction: ({ key, data }: { key: string; data: Ticker }) =>
      wsTickerUpdate({ key, data }),
  },

  depth: {
    key: (symbol?: string) => (symbol ? symbol.toUpperCase() : 'UNKNOWN_DEPTH'),
    parseMessage: (msg): Depth | null => {
      if (!msg.b || !msg.a) return null
      return {
        lastUpdateId: msg.u,
        firstUpdateId: msg.U,
        bids: msg.b,
        asks: msg.a,
      }
    },
    reducerAction: ({ key, data }: { key: string; data: Depth }) => {
      return { type: 'depth/ws_update', payload: { key, data } }
    },
  },

  aggTrade: {
    key: (symbol?: string) => (symbol ? symbol.toUpperCase() : 'UNKNOWN_TRADE'),
    parseMessage: (msg): Trade | null => {
      if (!msg || msg.p == null) return null
      return {
        id: msg.t,
        price: msg.p,
        qty: msg.q,
        quoteQty: msg.q * msg.p,
        time: msg.T,
        isBuyerMaker: msg.m,
        isBestMatch: msg.M,
      }
    },
    reducerAction: ({ key, data }: { key: string; data: Trade }) =>
      addNewTrade(data),
  },

  miniTicker: {
    key: () => 'miniTicker',
    parseMessage: (msg): MiniTicker[] | null => {
      const parsedItems: MiniTicker[] = msg.map((item: RawMiniTickerItem) => {
        const close = parseFloat(item.c)
        const open = parseFloat(item.o)
        const volume = parseFloat(item.v)
        const quoteVolume = parseFloat(item.q)
        const percentChange = open !== 0 ? ((close - open) / open) * 100 : 0
        return {
          symbol: item.s,
          close: close,
          open: open,
          high: parseFloat(item.h),
          low: parseFloat(item.l),
          volume: volume,
          quoteVolume: quoteVolume,
          percentChange: percentChange,
        }
      })
      return parsedItems
    },
    reducerAction: ({ data }: { data: MiniTicker[] }) => updateMiniTicker(data),
  } as StreamHandler<MiniTicker[]>,
}

export function registerStream<K extends keyof typeof streamRegistry>(
  type: K,
  symbol?: string,
  params?: { interval?: string; delay?: string },
) {
  const lowerSymbol = symbol?.toLowerCase()

  let streamName: string

  if (type === 'kline' && params?.interval) {
    streamName = `${lowerSymbol}@kline_${params.interval}`
  } else if (type === 'depth' && params?.delay) {
    streamName = `${lowerSymbol}@${type}@${params.delay}`
  } else if (type === 'miniTicker') {
    streamName = `!${type}@arr`
  } else {
    streamName = `${lowerSymbol}@${type}`
  }

  const handler = streamRegistry[type] as StreamHandler<StreamMap[K]>
  const key = handler.key(symbol, params?.interval)

  return {
    stream: streamName,
    onMessage: (data: any) => {
      const parsed = handler.parseMessage(data)
      if (parsed) {
        store.dispatch(handler.reducerAction({ key, data: parsed }))
      }
    },
  }
}
