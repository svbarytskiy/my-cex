import { useState, useCallback } from 'react'
import { useAppSelector } from 'store/store'
import {
  AggregatedTradePair,
  selectFilteredAndSortedTradingPairs,
} from 'store/slices/miniTicker/miniTickerSelector'
import { TABS } from '../constants'


type SortDirection = 'asc' | 'desc' | null

interface UseTickerListLogicResult {
  activeTab: (typeof TABS)[number]
  handleTabClick: (tab: (typeof TABS)[number]) => void
  activeSubTabId: string | null
  handleSubTabClick: (id: string) => void
  searchTerm: string
  handleSearchChange: (value: string) => void
  sortColumn: string | null
  sortDirection: SortDirection
  handleSort: (columnId: string | null, newSortDirection: SortDirection) => void
  filteredAndSortedPairs: AggregatedTradePair[]
}

export const useTickerListLogic = (): UseTickerListLogicResult => {
  const [activeTab, setActiveTab] = useState(TABS[0])
  const [activeSubTabId, setActiveSubTabId] = useState<string | null>(
    activeTab.subTabs?.[0]?.id || null,
  )
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)

  const handleTabClick = useCallback((tab: (typeof TABS)[number]) => {
    setActiveTab(tab)
    setActiveSubTabId(tab.subTabs?.[0]?.id || null)
  }, [])

  const handleSubTabClick = useCallback((id: string) => {
    setActiveSubTabId(id)
  }, [])

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value)
    setActiveSubTabId(null)
  }, [])

  const handleSort = useCallback(
    (columnId: string | null, newSortDirection: SortDirection) => {
      setSortColumn(columnId)
      setSortDirection(newSortDirection)
    },
    [],
  )

  const filteredAndSortedPairs: AggregatedTradePair[] = useAppSelector(state =>
    selectFilteredAndSortedTradingPairs(
      state,
      searchTerm,
      activeTab.id,
      activeSubTabId,
      sortColumn,
      sortDirection,
    ),
  )

  return {
    activeTab,
    handleTabClick,
    activeSubTabId,
    handleSubTabClick,
    searchTerm,
    handleSearchChange,
    sortColumn,
    sortDirection,
    handleSort,
    filteredAndSortedPairs,
  }
}
