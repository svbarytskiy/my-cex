import { FC } from 'react'
import { HorizontalScrollContainer } from 'common/components/HorizontalScrollContainer/HorizontalScrollContainer'
import { TabButton } from 'common/ui/tab-button'
import { SortChip } from '../../ui/SortChip/SortChip'
import {
  SortableColumn,
  SortDirection,
  Tab,
} from 'features/tickers-watchlist/types/model'
import { SortableTableHeader } from '../SortableTableHeader/SortableTableHeader'
import { TABS } from '../../constants'

interface TickerListHeaderProps {
  activeTab: Tab
  onTabClick: (id: Tab) => void
  activeSubTabId: string | null
  onSubTabClick: (id: string) => void
  onSort: (
    columnId: SortableColumn['id'] | null,
    sortDirection: SortDirection,
  ) => void
  currentSortColumn: SortableColumn['id'] | null
  currentSortDirection: 'asc' | 'desc' | null
}

const TickerListHeader: FC<TickerListHeaderProps> = ({
  activeTab,
  onTabClick,
  activeSubTabId,
  onSubTabClick,
  onSort,
  currentSortColumn,
  currentSortDirection,
}) => {
  return (
    <div >
      <div className="px-4 border-b border-border-color">
        <HorizontalScrollContainer scrollAmount={150} scrollToId={activeTab.id}>
          {TABS.map(tab => (
            <TabButton
              key={tab.id}
              label={tab.label}
              isActive={tab.id === activeTab.id}
              onClick={() => onTabClick(tab)}
              id={tab.id}
            />
          ))}
        </HorizontalScrollContainer>
      </div>
      {activeTab?.subTabs && activeTab.subTabs.length > 0 && (
        <div className="flex gap-2 mt-2 px-4">
          <HorizontalScrollContainer scrollAmount={150}>
            {activeTab.subTabs.map(subTab => (
              <SortChip
                key={subTab.id}
                label={subTab.label}
                isActive={subTab.id === activeSubTabId}
                onClick={() => onSubTabClick(subTab.id)}
              />
            ))}
          </HorizontalScrollContainer>
        </div>
      )}
      <div>
        <SortableTableHeader
          initialSortBy={currentSortColumn}
          initialSortDirection={currentSortDirection}
          onSortChange={onSort}
        />
      </div>
    </div>
  )
}

export { TickerListHeader }
