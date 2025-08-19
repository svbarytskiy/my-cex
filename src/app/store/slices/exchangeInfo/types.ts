export interface SymbolFilter {
  filterType: string
  minPrice?: string
  maxPrice?: string
  tickSize?: string
  stepSize?: string
  minQty?: string
  maxQty?: string
  minNotional?: string
  [key: string]: any
}

export interface SymbolInfo {
  symbol: string
  status: string
  baseAsset: string
  baseAssetPrecision: number
  quoteAsset: string
  quotePrecision: number
  orderTypes: string[]
  icebergAllowed: boolean
  isSpotTradingAllowed: boolean
  isMarginTradingAllowed: boolean
  filters: SymbolFilter[]
}

export interface ExchangeInfoResponse {
  timezone: string
  serverTime: number
  symbols: SymbolInfo[]
}
