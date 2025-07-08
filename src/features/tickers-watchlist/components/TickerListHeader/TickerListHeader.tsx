import { FC } from 'react'
import styles from './TickerListHeader.module.css'
import { HorizontalScrollContainer } from 'common/components/HorizontalScrollContainer/HorizontalScrollContainer'
import { TabButton } from 'common/components/TabButton/TabButton'
import {
  SortableColumn,
  SortableTableHeader,
  SortDirection,
} from '../SortableTableHeader/SortableTableHeader'
import { SortChip } from '../SortChip/SortChip'

interface SubTab {
  id: string
  label: string
}

interface Tab {
  id: string
  label: string
  subTabs?: SubTab[]
}

interface TickerListHeaderProps {
  tabs: Tab[]
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
  tabs,
  activeTab,
  onTabClick,
  activeSubTabId,
  onSubTabClick,
  onSort,
  currentSortColumn,
  currentSortDirection,
}) => {
  return (
    <div className={styles.tickerListHeader}>
      <div className={styles.mainTabsSection}>
        <HorizontalScrollContainer scrollAmount={150}>
          {tabs.map(tab => (
            <TabButton
              key={tab.id}
              label={tab.label}
              isActive={tab.id === activeTab.id}
              onClick={() => onTabClick(tab)}
            />
          ))}
        </HorizontalScrollContainer>
      </div>
      {activeTab?.subTabs && activeTab.subTabs.length > 0 && (
        <div className={styles.subTabsSection}>
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
      <div className={styles.tableHeaderSection}>
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
