import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { fetchExchangeInfo } from './exchangeInfoThunks'
import { ExchangeInfoResponse, SymbolInfo } from './types'

interface ExchangeInfoState {
  data: {
    timezone: string
    serverTime: number
    symbols: Record<string, SymbolInfo>
  } | null
  isLoading: boolean
  error: string | null
}

const initialState: ExchangeInfoState = {
  data: null,
  isLoading: false,
  error: null,
}

const exchangeInfoSlice = createSlice({
  name: 'exchangeInfo',
  initialState,
  reducers: {
    clearExchangeInfo: state => {
      state.data = null
      state.error = null
      state.isLoading = false
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchExchangeInfo.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(
        fetchExchangeInfo.fulfilled,
        (state, action: PayloadAction<ExchangeInfoResponse>) => {
          state.isLoading = false
          const symbolsRecord = action.payload.symbols.reduce(
            (acc, symbol) => {
              acc[symbol.symbol] = symbol
              return acc
            },
            {} as Record<string, SymbolInfo>,
          )

          state.data = {
            timezone: action.payload.timezone,
            serverTime: action.payload.serverTime,
            symbols: symbolsRecord,
          }
        },
      )
      .addCase(fetchExchangeInfo.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || 'Unknown error'
      })
  },

  selectors: {
    selectExchangeInfoData: state => state.data,
    selectExchangeInfoLoading: state => state.isLoading,
    selectExchangeInfoError: state => state.error,
    selectAllSymbolsRecord: state => state.data?.symbols || null,
    selectSymbolInfo: (state, symbol: string) =>
      state.data?.symbols[symbol] || null,
    selectBaseQuoteAssetsBySymbol: (state, symbol: string) => {
      const symbolInfo = state.data?.symbols[symbol]
      if (symbolInfo) {
        return {
          baseAsset: symbolInfo.baseAsset,
          quoteAsset: symbolInfo.quoteAsset,
        }
      }
      return null
    },
    selectTickSizeBySymbol: (state, symbol: string) => {
      const symbolInfo = state.data?.symbols[symbol]
      if (symbolInfo) {
        const priceFilter = symbolInfo.filters.find(
          filter => filter.filterType === 'PRICE_FILTER',
        )! as { tickSize: string }

        return priceFilter.tickSize
      }
      return null
    },
    selectMinQtyBySymbol: (state, symbol: string) => {
      const symbolInfo = state.data?.symbols[symbol]
      if (symbolInfo) {
        const lotSizeFilter = symbolInfo.filters.find(
          filter => filter.filterType! === 'LOT_SIZE',
        )! as { minQty: string }
        return lotSizeFilter.minQty
      }
      return null
    },
  },
})

export const { clearExchangeInfo } = exchangeInfoSlice.actions

export const {
  selectExchangeInfoData,
  selectExchangeInfoLoading,
  selectExchangeInfoError,
  selectAllSymbolsRecord,
  selectSymbolInfo,
  selectBaseQuoteAssetsBySymbol,
  selectTickSizeBySymbol,
  selectMinQtyBySymbol,
} = exchangeInfoSlice.selectors

export default exchangeInfoSlice.reducer
