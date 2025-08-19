import { createSelector } from '@reduxjs/toolkit'
import { SymbolFilter } from '../exchangeInfo/types'
import { TAB_FILTER_RULES } from './filterRules'
import {
  selectAllSymbolsRecord,
  selectExchangeInfoLoading,
} from '../exchangeInfo/exchangeInfoSlice'
import { selectFavoritePairSymbols } from '../pairSettings/pairSettings.slice'
import { selectMiniTickers, selectMiniTickersLoading } from './miniTickerSlice'
import { RootState } from 'app/store/store'

export interface AggregatedTradePair {
  id: string
  symbol: string
  baseAsset: string
  quoteAsset: string
  currentPrice: number
  volume: number
  priceChange24h: number
  priceTickSize: string
  quantityStepSize: string
  status: string
  isSpotTradingAllowed: boolean
  isMarginTradingAllowed: boolean
  isFavorite: boolean
}

export const selectAggregatedTradingPairs = createSelector(
  [selectMiniTickers, selectAllSymbolsRecord, selectFavoritePairSymbols],
  (
    miniTickers,
    exchangeInfoSymbols,
    favoritePairSymbols,
  ): AggregatedTradePair[] => {
    if (exchangeInfoSymbols === null) {
      return []
    }

    const aggregatedPairs = Object.keys(miniTickers)
      .map(symbol => {
        const miniTickerData = miniTickers[symbol]
        const exchangeSymbolInfo = exchangeInfoSymbols[symbol]

        if (!exchangeSymbolInfo || miniTickerData.close === 0) {
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
          isFavorite: favoritePairSymbols.includes(symbol),
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
    (_: RootState, searchTerm: string) => searchTerm,
    (_: RootState, searchTerm: string, activeTabId: string) =>
      activeTabId,
    (
      _: RootState,
      searchTerm: string,
      activeTabId: string,
      activeSubTabId: string | null,
    ) => activeSubTabId,
    (
      _: RootState,
      searchTerm: string,
      activeTabId: string,
      activeSubTabId: string | null,
      sortColumn: string | null,
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
    if (miniTickersLoading || exchangeInfoLoading || pairs.length === 0) {
      return []
    }

    let filteredPairs = [...pairs]

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase()
      // eslint-disable-next-line no-useless-escape
      const normalizedSearchTerm = lowerCaseSearchTerm.replace(/[\/\s]/g, '')

      filteredPairs = filteredPairs.filter(p => {
        // eslint-disable-next-line no-useless-escape
        const normalizedPairId = p.id.toLowerCase().replace(/[\/\s]/g, '')
        const normalizedFormattedSymbol = p.symbol
          .toLowerCase()
          // eslint-disable-next-line no-useless-escape
          .replace(/[\/\s]/g, '')

        return (
          normalizedPairId.includes(normalizedSearchTerm) ||
          normalizedFormattedSymbol.includes(normalizedSearchTerm) ||
          p.baseAsset.toLowerCase().includes(lowerCaseSearchTerm) ||
          p.quoteAsset.toLowerCase().includes(lowerCaseSearchTerm)
        )
      })
    } else {
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
          return 0
        }

        if (typeof valA === 'string' && typeof valB === 'string') {
          return sortDirection === 'asc'
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA)
        } else {
          const numA = Number(valA) || 0
          const numB = Number(valB) || 0
          return sortDirection === 'asc' ? numA - numB : numB - numA
        }
      })
    }

    return filteredPairs
  },
)
