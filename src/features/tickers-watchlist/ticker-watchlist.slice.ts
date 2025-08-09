import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SortDirection, Tab } from './types/model'
import { TABS } from './constants'

export interface TickerWatchlistState {
  tab: Tab
  subTab: string | null
  sortColumn: string | null
  sortDirection: SortDirection
}
const defaultTab = TABS[0]
const defaultSubTab = defaultTab.subTabs?.[0]?.id ?? null

const initialState: TickerWatchlistState = {
  tab: defaultTab,
  subTab: defaultSubTab,
  sortColumn: null,
  sortDirection: null,
}

const tickerWatchlistSlice = createSlice({
  name: 'tickerWatchlist',
  initialState,
  reducers: {
    setTab(state, action: PayloadAction<Tab>) {
      state.tab = action.payload
      state.subTab = null
    },
    setSubTab(state, action: PayloadAction<string | null>) {
      state.subTab = action.payload
    },
    setSort(
      state,
      action: PayloadAction<{
        columnId: string | null
        direction: SortDirection
      }>,
    ) {
      state.sortColumn = action.payload.columnId
      state.sortDirection = action.payload.direction
    },
  },
})

export const { setTab, setSubTab, setSort } = tickerWatchlistSlice.actions

export default tickerWatchlistSlice.reducer
