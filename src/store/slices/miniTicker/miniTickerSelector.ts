import { createSelector } from '@reduxjs/toolkit'
import { RootState } from 'store/store' // Переконайтесь, що шлях до RootState коректний
import { SymbolInfo, SymbolFilter } from '../exchangeInfo/types' // Переконайтесь, що шлях коректний
import { TAB_FILTER_RULES } from './filterRules' // Переконайтесь, що шлях коректний
import { MiniTicker } from './types'

export interface AggregatedTradePair {
  id: string // Оригінальний символ, наприклад "BTCUSDT"
  symbol: string // Форматований символ "BTC/USDT"
  baseAsset: string
  quoteAsset: string
  currentPrice: number
  volume: number
  priceChange24h: number
  priceTickSize: string
  quantityStepSize: string
  status: string // Active, Break, etc.
  isSpotTradingAllowed: boolean
  isMarginTradingAllowed: boolean
}

// --- Вхідні селектори ---
// Тепер коректно звертаємось до miniTickerState
const selectMiniTickers = (state: RootState): Record<string, MiniTicker> =>
  state.miniTicker.miniTickers
const selectMiniTickersLoading = (state: RootState): boolean =>
  state.miniTicker.loading

const selectExchangeInfoData = (state: RootState) => state.exchangeInfo.data
const selectExchangeInfoLoading = (state: RootState) =>
  state.exchangeInfo.isLoading

const selectExchangeInfoSymbolsNormalized = createSelector(
  selectExchangeInfoData,
  exchangeInfoData => {
    if (!exchangeInfoData || !exchangeInfoData.symbols) {
      return {}
    }
    return exchangeInfoData.symbols.reduce(
      (acc, symbolInfo) => {
        acc[symbolInfo.symbol] = symbolInfo
        return acc
      },
      {} as { [key: string]: SymbolInfo },
    )
  },
)

// --- Допоміжні функції (залишаються без змін) ---
export const getPrecisionFromMinPrice = (minPriceStr: string): number => {
  if (!minPriceStr.includes('.')) return 0
  if (minPriceStr.includes('e-'))
    return parseInt(minPriceStr.split('e-')[1], 10)
  return minPriceStr.split('.')[1].length
}

// --- Основний агрегуючий селектор (залишається без змін у логіці, але типи MiniTicker тепер правильні) ---
export const selectAggregatedTradingPairs = createSelector(
  [selectMiniTickers, selectExchangeInfoSymbolsNormalized],
  (miniTickers, exchangeInfoSymbols): AggregatedTradePair[] => {
    if (Object.keys(exchangeInfoSymbols).length === 0) {
      return []
    }

    const aggregatedPairs = Object.keys(miniTickers)
      .map(symbol => {
        const miniTickerData = miniTickers[symbol]
        const exchangeSymbolInfo = exchangeInfoSymbols[symbol]

        if (!exchangeSymbolInfo) {
          return null
        }
        if (miniTickerData.close === 0) {
          return null
        }
        const priceFilter = exchangeSymbolInfo.filters.find(
          (f: SymbolFilter) => f.filterType === 'PRICE_FILTER',
        )
        const lotSizeFilter = exchangeSymbolInfo.filters.find(
          (f: SymbolFilter) => f.filterType === 'LOT_SIZE',
        )

        const priceTickSize = priceFilter?.tickSize || '0.00000001'
        const quantityStepSize = lotSizeFilter?.stepSize || '0.00000001'
        const formattedSymbol = `${exchangeSymbolInfo.baseAsset}/${exchangeSymbolInfo.quoteAsset}`

        return {
          id: symbol,
          symbol: formattedSymbol,
          baseAsset: exchangeSymbolInfo.baseAsset,
          isSpotTradingAllowed: exchangeSymbolInfo.isSpotTradingAllowed,
          isMarginTradingAllowed: exchangeSymbolInfo.isMarginTradingAllowed,
          quoteAsset: exchangeSymbolInfo.quoteAsset,
          currentPrice: miniTickerData.close,
          volume: miniTickerData.quoteVolume,
          priceChange24h: miniTickerData.percentChange,
          priceTickSize: priceTickSize,
          quantityStepSize: quantityStepSize,
          status: exchangeSymbolInfo.status,
        }
      })
      .filter(Boolean) as AggregatedTradePair[]
    return aggregatedPairs
  },
)

export const selectFilteredAndSortedTradingPairs = createSelector(
  [
    selectAggregatedTradingPairs,
    selectMiniTickersLoading,
    selectExchangeInfoLoading,
    (_: RootState, searchTerm: string, ...rest: any[]) => searchTerm,
    (_: RootState, searchTerm: string, activeTabId: string, ...rest: any[]) =>
      activeTabId,
    (
      _: RootState,
      searchTerm: string,
      activeTabId: string,
      activeSubTabId: string | null,
      ...rest: any[]
    ) => activeSubTabId,
    (
      _: RootState,
      searchTerm: string,
      activeTabId: string,
      activeSubTabId: string | null,
      sortColumn: string | null,
      ...rest: any[]
    ) => sortColumn,
    (
      _: RootState,
      searchTerm: string,
      activeTabId: string,
      activeSubTabId: string | null,
      sortColumn: string | null,
      sortDirection: 'asc' | 'desc' | null,
    ) => sortDirection,
  ],
  (
    pairs,
    miniTickersLoading,
    exchangeInfoLoading,
    searchTerm,
    activeTabId,
    activeSubTabId,
    sortColumn,
    sortDirection,
  ) => {
    // 1. Стан завантаження
    if (miniTickersLoading || exchangeInfoLoading || pairs.length === 0) {
      return []
    }

    let filteredPairs = [...pairs]

    // --- 2. Логіка ФІЛЬТРАЦІЇ ---
    // Пріоритет 1: Search Input (з урахуванням "нечіткого" пошуку)
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase()
      const normalizedSearchTerm = lowerCaseSearchTerm.replace(/[\/\s]/g, '')

      filteredPairs = filteredPairs.filter(p => {
        const normalizedPairId = p.id.toLowerCase().replace(/[\/\s]/g, '')
        const normalizedFormattedSymbol = p.symbol
          .toLowerCase()
          .replace(/[\/\s]/g, '')

        return (
          normalizedPairId.includes(normalizedSearchTerm) ||
          normalizedFormattedSymbol.includes(normalizedSearchTerm) ||
          p.baseAsset.toLowerCase().includes(lowerCaseSearchTerm) ||
          p.quoteAsset.toLowerCase().includes(lowerCaseSearchTerm)
        )
      })
    } else {
      // Пріоритет 2 & 3: Active Sub-Tab або Active Tab
      const filterId = activeSubTabId || activeTabId

      const filterFunction = TAB_FILTER_RULES[filterId]

      if (filterFunction) {
        filteredPairs = filteredPairs.filter(filterFunction)
      }
    }

    if (sortColumn !== null) {
      filteredPairs.sort((a, b) => {
        let valA: any, valB: any

        if (sortColumn === 'pair') {
          valA = a.symbol
          valB = b.symbol
        } else if (sortColumn === 'volume') {
          valA = a.volume
          valB = b.volume
        } else if (sortColumn === 'lastPrice') {
          valA = a.currentPrice
          valB = b.currentPrice
        } else if (sortColumn === 'change24h') {
          valA = a.priceChange24h
          valB = b.priceChange24h
        } else {
          return 0 // Невідома колонка сортування, не сортуємо
        }

        if (typeof valA === 'string' && typeof valB === 'string') {
          return sortDirection === 'asc'
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA)
        } else {
          // Гарантуємо, що це числа для порівняння.
          const numA = Number(valA) || 0
          const numB = Number(valB) || 0

          return sortDirection === 'asc' ? numA - numB : numB - numA
        }
      })
    }

    return filteredPairs
  },
)
