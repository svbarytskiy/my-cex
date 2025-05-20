export interface FetchOrderBookParams {
    symbol: string;
}

export interface FetchOrderBookResponse {
    key: string;
    lastUpdateId: number;
    bids: [string, string][];
    asks: [string, string][];
}

export interface OrderBook {
    lastUpdateId: number;
    firstUpdateId: number;
    bids: [string, string][];
    asks: [string, string][];
}

export interface OrderBookState {
    symbol?: string;
    lastUpdateId: number;
    bidsMap: Record<string, string>;
    asksMap: Record<string, string>;
    bidsArray: [string, string][];
    asksArray: [string, string][];
    bufferedEvents: OrderBook[];
    isInitialized: boolean;
    loading: boolean;
    error: string | null;
    wsConnected: boolean;
}

// store/slices/orderBook/types.ts

export type OrderBookLevel = [string, string];

export interface SnapshotPayload {
  lastUpdateId: number;
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
}

export interface DepthEvent {
  U: number;
  u: number;
  b: OrderBookLevel[];
  a: OrderBookLevel[];
}
