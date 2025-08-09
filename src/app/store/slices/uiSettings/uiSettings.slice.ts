import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UISettingsState {
  theme: 'dark' | 'light'
  defaultChartType: string
  defaultTimeframe: string
  panelLayout: Record<string, any>
  language: string
}

const initialState: UISettingsState = {
  theme: 'dark',
  defaultChartType: 'candlestick',
  defaultTimeframe: '1h',
  panelLayout: {},
  language: 'uk',
}

const uiSettingsSlice = createSlice({
  name: 'uiSettings',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'dark' | 'light'>) => {
      state.theme = action.payload
    },
    setDefaultChartType: (state, action: PayloadAction<string>) => {
      state.defaultChartType = action.payload
    },
    setDefaultTimeframe: (state, action: PayloadAction<string>) => {
      state.defaultTimeframe = action.payload
    },
    setPanelLayout: (state, action: PayloadAction<Record<string, any>>) => {
      state.panelLayout = action.payload
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload
    },
  },
})

export const {
  setTheme,
  setDefaultChartType,
  setDefaultTimeframe,
  setPanelLayout,
  setLanguage,
} = uiSettingsSlice.actions
export default uiSettingsSlice.reducer
