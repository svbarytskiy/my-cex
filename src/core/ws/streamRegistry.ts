// core/ws/streamRegistry.ts
import { store } from '../../store/store'
// import { wsTickerUpdate } from '@/features/ticker/tickerSlice';
// import { wsOrderBookUpdate } from '@/features/orderBook/orderBookSlice';
import { wsCandleUpdate } from '../../store/slices/candles/candlesSlice'
import { Candle } from '../../store/slices/candles/types'
import { OrderBook } from '../../store/slices/orderBook/types'
import { wsTickerUpdate } from '../../store/slices/ticker/tickerSlice'
import Ticker from '../../store/slices/ticker/types'
import Trade from '../../store/slices/lastTrades/types'
import { addNewTrade } from '../../store/slices/lastTrades/lastTradesSlice'
import { MiniTicker, MiniTickerResponse } from 'store/slices/miniTicker/types'
import { updateMiniTicker } from 'store/slices/miniTicker/miniTickerSlice'
export interface RawMiniTickerItem {
  e: string // Event type
  E: number // Event time
  s: string // Symbol
  c: string // Close price
  o: string // Open price
  h: string // High price
  l: string // Low price
  v: string // Base asset volume
  q: string // Quote asset volume
}
export interface StreamHandler<T> {
  key: (symbol?: string, interval?: string) => string
  parseMessage: (msg: any) => T | null
  reducerAction: (payload: { key: string; data: T }) => any
}

export const streamRegistry = {
  kline: {
    key: (symbol: string, interval?: string) =>
      `${symbol.toUpperCase()}_${interval}`,
    parseMessage: (msg): Candle | null => {
      if (!msg.k) return null
      return {
        time: Math.floor(msg.k.t / 1000),
        open: +msg.k.o,
        high: +msg.k.h,
        low: +msg.k.l,
        close: +msg.k.c,
        volume: +msg.k.v,
      }
    },
    reducerAction: ({ key, data }: { key: string; data: Candle }) =>
      wsCandleUpdate({ key, data }),
  } as StreamHandler<Candle>,

  ticker: {
    key: (symbol: string) => symbol.toUpperCase(),
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
  } as StreamHandler<Ticker>,

  depth: {
    key: (symbol: string) => symbol.toUpperCase(),
    parseMessage: (msg): OrderBook | null => {
      if (!msg.b || !msg.a) return null
      return {
        lastUpdateId: msg.u,
        firstUpdateId: msg.U,
        bids: msg.b,
        asks: msg.a,
      }
    },
  } as StreamHandler<OrderBook>,
  aggTrade: {
    key: (symbol: string) => symbol.toUpperCase(),
    parseMessage: (msg): Trade | null => {
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
    reducerAction: ({ data }: { data: Trade }) => addNewTrade(data),
  } as StreamHandler<Trade>,

  miniTicker: {
    key: () => 'miniTicker',
    parseMessage: (msg): MiniTickerResponse | null => {
      const parsedItems: MiniTicker[] = msg.map((item: RawMiniTickerItem) => {
        const close = parseFloat(item.c)
        const open = parseFloat(item.o)
        const volume = parseFloat(item.v)
        const quoteVolume = parseFloat(item.q)

        // Handle potential division by zero if open is 0
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
      console.log('Parsed MiniTicker:', parsedItems)

      return {
        data: parsedItems,
      }
    },
    reducerAction: ({ data }: { data: MiniTicker[] }) => updateMiniTicker(data),
  } as StreamHandler<MiniTicker[]>,
}

export function registerStream<T>(
  type: keyof typeof streamRegistry,
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

  const handler = streamRegistry[type]
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
