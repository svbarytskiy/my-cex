export interface FetchOrderBookParams {
  symbol: string
}

export interface FetchDepthResponse {
  key: string
  lastUpdateId: number
  bids: [string, string][]
  asks: [string, string][]
}

export interface Depth {
  lastUpdateId: number
  firstUpdateId: number
  bids: [string, string][]
  asks: [string, string][]
}

export interface DepthState {
  symbol?: string
  lastUpdateId: number
  bidsMap: Record<string, string>
  asksMap: Record<string, string>
  bidsArray: [string, string][]
  asksArray: [string, string][]
  bufferedEvents: Depth[]
  isInitialized: boolean
  loading: boolean
  error: string | null
  wsConnected: boolean
}

export type DepthLevel = [string, string]

export interface SnapshotPayload {
  lastUpdateId: number
  bids: DepthLevel[]
  asks: DepthLevel[]
}

export interface DepthEvent {
  U: number
  u: number
  b: DepthLevel[]
  a: DepthLevel[]
  s: string
}

export type ProcessedDepthData = {
  bids: DepthLevel[];
  asks: DepthLevel[];
  lastUpdateId: number;
  resyncNeeded?: boolean;
};