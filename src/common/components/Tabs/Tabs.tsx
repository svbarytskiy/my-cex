// src/shared/ui/tabs/ui/Tabs.tsx
import React, { useState } from 'react'
import styles from './Tabs.module.css'

interface TabItem {
  id: string
  label: string
  content: React.ReactNode
}

interface TabsProps {
  tabs: TabItem[]
  defaultActiveId?: string
}

export const Tabs = ({ tabs, defaultActiveId }: TabsProps) => {
  const [activeId, setActiveId] = useState(defaultActiveId || tabs[0]?.id)

  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabsHeader}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`${styles.tabButton} ${activeId === tab.id ? styles.active : ''}`}
            onClick={() => setActiveId(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className={styles.tabsContent}>
        {tabs.find(tab => tab.id === activeId)?.content}
      </div>
    </div>
  )
}
