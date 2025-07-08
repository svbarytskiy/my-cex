import { FC, useEffect, RefObject } from 'react'
import styles from './TickersWatchList.module.css'
import { SearchInput } from 'common/components/SearchInput/SearchInput'
import { useAppDispatch, useAppSelector } from 'store/store'
import {
  fetchInitialMiniTickers,
  subscribeMiniTickerWS,
} from 'store/slices/miniTicker/miniTickerThunk'
import { TickerListHeader } from './components/TickerListHeader/TickerListHeader'
import { TABS } from './constants'
import { fetchExchangeInfo } from 'store/slices/exchangeInfo/exchangeInfoThunks'
import { ClickAwayListener } from 'common/components/ClickAwayListener/ClickAwayListener'
import { TickerListContent } from './components/TickerListContent/TickerListContent'
import { useTickerListLogic } from './hooks/useTickerWatchListLogic'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorFallback } from 'common/components/ErrorFallback/ErrorFallback'
import { logError } from 'utils/logError'

interface TickersWatchListProps {
  isOpen: boolean
  onClose: () => void
  triggerRef?: RefObject<HTMLButtonElement | null>
}

const TickersWatchList: FC<TickersWatchListProps> = ({
  isOpen,
  onClose,
  triggerRef,
}) => {
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
    if (data == null || data.symbols.length === 0) {
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
    <ClickAwayListener
      onOutsideClick={onClose}
      isOpen={isOpen}
      triggerRef={triggerRef}
    >
      <div className={styles.tickersWatchListContainer}>
        <ErrorBoundary FallbackComponent={ErrorFallback} onError={logError}>
          <div className={styles.searchInputBox}>
            <SearchInput
              initialValue={searchTerm}
              onSearchChange={handleSearchChange}
            />
          </div>

          <TickerListHeader
            tabs={TABS}
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
    </ClickAwayListener>
  )
}
export { TickersWatchList }
