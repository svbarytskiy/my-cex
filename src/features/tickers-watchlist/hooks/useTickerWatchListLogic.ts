import { useCallback, useState } from 'react'
import { setTab, setSubTab, setSort } from '../ticker-watchlist.slice'
import { selectFilteredAndSortedTradingPairs } from 'app/store/slices/miniTicker/miniTickerSelector'
import { SortDirection, Tab } from '../types/model'
import { useAppDispatch, useAppSelector } from 'app/store/store'

export const useTickerListLogic = () => {
  const dispatch = useAppDispatch()
  const [searchTerm, setSearchTerm] = useState<string>('')
  const activeTab = useAppSelector(state => state.tickerWatchlist.tab)
  const subTabId = useAppSelector(state => state.tickerWatchlist.subTab)
  const sortColumn = useAppSelector(state => state.tickerWatchlist.sortColumn)
  const sortDirection = useAppSelector(
    state => state.tickerWatchlist!.sortDirection,
  )

  const handleTabClick = useCallback(
    (tab: Tab) => {
      dispatch(setTab(tab))
      if (tab.subTabs) {
        dispatch(setSubTab(tab.subTabs[0].id))
      }
    },
    [dispatch],
  )

  const handleSubTabClick = useCallback(
    (subTabId: string) => {
      dispatch(setSubTab(subTabId))
    },
    [dispatch],
  )

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchTerm(value)
    },
    [dispatch],
  )

  const handleSort = useCallback(
    (columnId: string | null, direction: SortDirection) => {
      dispatch(setSort({ columnId, direction }))
    },
    [dispatch],
  )

  const filteredAndSortedPairs = useAppSelector(state =>
    selectFilteredAndSortedTradingPairs(
      state,
      searchTerm,
      activeTab.id,
      subTabId,
      sortColumn,
      sortDirection,
    ),
  )

  return {
    activeTab,
    activeSubTabId: subTabId,
    handleTabClick,
    handleSubTabClick,
    searchTerm,
    handleSearchChange,
    sortColumn,
    sortDirection,
    handleSort,
    filteredAndSortedPairs,
  }
}
