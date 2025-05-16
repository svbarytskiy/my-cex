import { KlineInterval } from "../../../binance/types/kline";

export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  isClosed?: boolean;
}

export interface CacheEntry {
  candles: Candle[];
  fetchedAt: number;
  wsSubscribed?: boolean;
}

export interface CandlesState {
  entries: Record<string, CacheEntry>;
  loading: boolean;
  streamingData: Record<string, Candle>;
  error: string | null;
}

export interface FetchCandlesParams {
  symbol: string;
  interval: KlineInterval;
}

export interface FetchCandlesResponse {
  key: string;
  candles: Candle[];
}
