export interface ProcessedOrder {
  price: string
  quantity: string
  total: string
}

export type OrderBookView = 'default' | 'bidsOnly' | 'asksOnly'
export type DepthVisualizationType = 'price-levels' | 'cumulative'
export type TotalColumnCurrency = 'base' | 'quote'
export type TotalColumnType = 'cumulative-sum' | 'level-amount'
export interface Order {
  price: string
  quantity: string
  total: string
}

export interface HoverInfo {
  price: string
  type: 'ask' | 'bid'
  yOffset: number
  xOffset: number
  yPosition: number
  index: number
}

export interface AggregatedData {
  avgPrice: number
  total: number
  quoteSum: number
}
