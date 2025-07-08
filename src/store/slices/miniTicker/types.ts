export type MiniTicker = {
  symbol: string
  close: number
  open: number
  high: number
  low: number
  volume: number
  quoteVolume: number
  percentChange: number
}

export type MiniTickerResponse = {
  data: Omit<MiniTicker, 'percentChange'>[]
}

export type Ticker24hrResponse = {
  symbol: string
  lastPrice: string
  openPrice: string
  highPrice: string
  lowPrice: string
  volume: string
  quoteVolume: string
  priceChangePercent: string
}
