import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from 'store/store'

interface SinglePairSettings {
  isFavorite: boolean
  orderBookAggregation: string | null
  drawingTools: Record<string, any>
  notes: string
}

interface PairSettingsState {
  [pairSymbol: string]: SinglePairSettings
}

const initialState: PairSettingsState = {}

const pairSettingsSlice = createSlice({
  name: 'pairSettings',
  initialState,
  reducers: {
    setInitialPairSettings: (
      state,
      action: PayloadAction<{
        pairSymbol: string
        initialSettings?: Partial<SinglePairSettings>
      }>,
    ) => {
      const { pairSymbol, initialSettings } = action.payload
      if (!state[pairSymbol]) {
        state[pairSymbol] = {
          isFavorite: false,
          orderBookAggregation: null,
          drawingTools: {},
          notes: '',
          ...initialSettings,
        }
      }
    },
    toggleFavoriteStatus: (state, action: PayloadAction<string>) => {
      const pairSymbol = action.payload
      if (state[pairSymbol]) {
        state[pairSymbol].isFavorite = !state[pairSymbol].isFavorite
      } else {
        state[pairSymbol] = {
          isFavorite: true,
          orderBookAggregation: null,
          drawingTools: {},
          notes: '',
        }
      }
    },
    updatePairSetting: (
      state,
      action: PayloadAction<{
        pairSymbol: string
        key: 'orderBookAggregation' | 'drawingTools' | 'notes' | 'isFavorite'
        value: any
      }>,
    ) => {
      const { pairSymbol, key, value } = action.payload
      if (state[pairSymbol]) {
        if (key === 'isFavorite') {
          state[pairSymbol].isFavorite = value as boolean
        } else if (key === 'orderBookAggregation') {
          state[pairSymbol].orderBookAggregation = value as string | null
        } else if (key === 'drawingTools') {
          state[pairSymbol].drawingTools = value as Record<string, any>
        } else if (key === 'notes') {
          state[pairSymbol].notes = value as string
        }
      }
    },
    setPairSettings: (
      state,
      action: PayloadAction<{
        pairSymbol: string
        settings: Partial<SinglePairSettings>
      }>,
    ) => {
      const { pairSymbol, settings } = action.payload
      if (state[pairSymbol]) {
        state[pairSymbol] = { ...state[pairSymbol], ...settings }
      } else {
        state[pairSymbol] = {
          isFavorite: false,
          orderBookAggregation: null,
          drawingTools: {},
          notes: '',
          ...settings,
        }
      }
    },
    updatePairDrawingTools: (
      state,
      action: PayloadAction<{
        pairSymbol: string
        toolData: Record<string, any>
      }>,
    ) => {
      const { pairSymbol, toolData } = action.payload
      if (state[pairSymbol]) {
        state[pairSymbol].drawingTools = toolData
      }
    },
  },
})

export const {
  setInitialPairSettings,
  toggleFavoriteStatus,
  updatePairSetting,
  setPairSettings,
  updatePairDrawingTools,
} = pairSettingsSlice.actions

export default pairSettingsSlice.reducer

export const selectIsPairFavorite = (state: RootState, pairSymbol: string) => {
  return !!state.pairSettings[pairSymbol]?.isFavorite
}

export const selectPairSettings = (state: RootState, pairSymbol: string) => {
  return state.pairSettings[pairSymbol]
}

export const selectFavoritePairSymbols = (state: RootState) => {
  return Object.keys(state.pairSettings).filter(
    pairSymbol => state.pairSettings[pairSymbol].isFavorite,
  )
}

export const selectCachedPairSymbols = (state: RootState) => {
  return Object.keys(state.pairSettings)
}
