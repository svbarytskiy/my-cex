import { FC, useEffect } from 'react'
import { SearchInput } from 'common/ui/search-input'
import {
  fetchInitialMiniTickers,
  subscribeMiniTickerWS,
} from 'app/store/slices/miniTicker/miniTickerThunk'
import { TickerListHeader } from './components/TickerListHeader/TickerListHeader'
import { TickerListContent } from './components/TickerListContent/TickerListContent'
import { useTickerListLogic } from './hooks/useTickerWatchListLogic'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorFallback } from 'common/components/ErrorFallback/ErrorFallback'
import { logError } from 'common/utils/logError'
import { fetchExchangeInfo } from 'app/store/slices/exchangeInfo/exchangeInfoThunks'
import { useAppSelector, useAppDispatch } from 'app/store/store'

const TickersWatchList: FC = ({}) => {
  const { data } = useAppSelector(state => state.exchangeInfo)
  const { miniTickers, wsConnected } = useAppSelector(state => state.miniTicker)
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (!wsConnected) {
      dispatch(subscribeMiniTickerWS())
    }
    if (Object.keys(miniTickers).length === 0) {
      dispatch(fetchInitialMiniTickers())
    }
    if (data == null) {
      dispatch(fetchExchangeInfo())
    }
  }, [])

  const { loading } = useAppSelector(state => state.miniTicker)
  const {
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
  } = useTickerListLogic()

  return (
    <div className="h-full w-full flex flex-col bg-background-tertiary rounded-lg">
      <ErrorBoundary FallbackComponent={ErrorFallback} onError={logError}>
        <div className="pt-[15px] px-[15px]">
          <SearchInput
            initialValue={searchTerm}
            onSearchChange={handleSearchChange}
          />
        </div>

        <TickerListHeader
          activeTab={activeTab}
          onTabClick={handleTabClick}
          activeSubTabId={activeSubTabId}
          onSubTabClick={handleSubTabClick}
          onSort={handleSort}
          currentSortColumn={sortColumn}
          currentSortDirection={sortDirection}
        />
        <TickerListContent pairs={filteredAndSortedPairs} loading={loading} />
      </ErrorBoundary>
    </div>
  )
}
export { TickersWatchList }
