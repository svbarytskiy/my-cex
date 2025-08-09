import { Time } from 'lightweight-charts'

export interface Candle {
  time: Time
  open: number
  high: number
  low: number
  close: number
  volume: number
  isClosed?: boolean
}

export interface CacheEntry {
  candles: Candle[]
  fetchedAt: number
  wsSubscribed?: boolean
}

export interface CandlesState {
  entries: Record<string, CacheEntry>
  loading: boolean
  streamingData: Record<string, Candle>
  error: string | null
}

export interface FetchCandlesParams {
  symbol: string
  interval: KlineInterval
}

export interface FetchCandlesResponse {
  key: string
  candles: Candle[]
}

export type KlineInterval =
  | '1s'
  | '1m'
  | '3m'
  | '5m'
  | '15m'
  | '30m'
  | '1h'
  | '4h'
  | '1d'
  | '1w'
  | '1M'

export interface KlineMessage {
  e: string
  E: number
  s: string
  k: {
    t: number
    T: number
    s: string
    i: KlineInterval
    o: string
    c: string
    h: string
    l: string
    v: string
    x: boolean
  }
}
