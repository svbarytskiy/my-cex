export interface OrderBook {
    lastUpdateId: number;
    firstUpdateId: number;
    bids: [string, string][];
    asks: [string, string][];
}

export interface FetchOrderBookParams {
    symbol: string;
}

export interface FetchOrderBookResponse {
    key: string;
    lastUpdateId: number;
    bids: [string, string][];
    asks: [string, string][];
}