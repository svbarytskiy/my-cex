import React, {
  useState,
  createContext,
  useContext,
  FC,
  ReactNode,
  useEffect,
  isValidElement,
} from 'react'

interface TabsContextType {
  activeId: string
  setActiveId: (id: string) => void
  allTabIds: string[]
}

const TabsContext = createContext<TabsContextType | undefined>(undefined)

const useTabsContext = () => {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error(
      'Tabs compound components (Tabs.Header, Tabs.Trigger, Tabs.Content) must be rendered as children of the <Tabs> component.',
    )
  }
  return context
}

interface TabsComponent extends FC<TabsProps> {
  Header: FC<TabsHeaderProps>
  Trigger: FC<TabsTriggerProps>
  Content: FC<TabsContentProps>
}

interface TabsProps {
  children: ReactNode
  defaultActiveId?: string
  className?: string
}

export const Tabs: TabsComponent = ({
  children,
  defaultActiveId,
  className,
}) => {
  const allTabIds: string[] = []

  let tabsHeader: ReactNode | undefined
  let tabsContent: ReactNode | undefined

  React.Children.forEach(children, child => {
    if (isValidElement(child)) {
      if (child.type === TabsHeader) {
        tabsHeader = child
        React.Children.forEach(
          (child.props as TabsHeaderProps).children,
          headerChild => {
            if (
              isValidElement(headerChild) &&
              headerChild.type === TabsTrigger
            ) {
              allTabIds.push((headerChild.props as TabsTriggerProps).value)
            }
          },
        )
      } else if (child.type === TabsContent) {
        tabsContent = child
      }
    }
  })

  const initialActiveId =
    defaultActiveId && allTabIds.includes(defaultActiveId)
      ? defaultActiveId
      : allTabIds[0] || ''

  const [activeId, setActiveId] = useState<string>(initialActiveId)

  useEffect(() => {
    if (
      defaultActiveId &&
      allTabIds.includes(defaultActiveId) &&
      activeId !== defaultActiveId
    ) {
      setActiveId(defaultActiveId)
    }
  }, [defaultActiveId, allTabIds, activeId])

  return (
    <TabsContext.Provider value={{ activeId, setActiveId, allTabIds }}>
      <div className={`font-inter bg-secondary ${className || ''}`}>
        {tabsHeader}
        {tabsContent}
      </div>
    </TabsContext.Provider>
  )
}

interface TabsHeaderProps {
  children: ReactNode
  className?: string
}

const TabsHeader: FC<TabsHeaderProps> = ({ children, className }) => (
  <div className={`flex ${className || ''}`}>{children}</div>
)

interface TabsTriggerProps {
  value: string
  label: string
  onClick?: () => void
  className?: string
}

const TabsTrigger: FC<TabsTriggerProps> = ({
  value,
  label,
  onClick,
  className,
}) => {
  const { activeId, setActiveId } = useTabsContext()
  const isActive = activeId === value

  const handleClick = () => {
    setActiveId(value)
    onClick?.()
  }

  return (
    <button
      className={`
        relative flex-1 py-2 bg-transparent border-none text-center text-xs md:text-base whitespace-nowrap
        font-medium cursor-pointer transition-all duration-200
        ${isActive ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'}
        ${className || ''}
      `}
      onClick={handleClick}
    >
      {label}
      {isActive && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-primary" />
      )}
    </button>
  )
}

interface TabsContentProps {
  id: string
  children: ReactNode
  className?: string
}

const TabsContent: FC<TabsContentProps> = ({ id, children, className }) => {
  const { activeId } = useTabsContext()

  if (activeId !== id) {
    return null
  }

  return <div className={`flex gap-2 ${className || ''}`}>{children}</div>
}

Tabs.Header = TabsHeader
Tabs.Trigger = TabsTrigger
Tabs.Content = TabsContent

export type { TabsProps, TabsHeaderProps, TabsTriggerProps, TabsContentProps }
