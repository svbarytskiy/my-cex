import { Children, FC, isValidElement, ReactNode } from 'react'

interface CardHeaderProps {
  children: ReactNode
  className?: string
}

const CardHeader: FC<CardHeaderProps> = ({ children, className }) => {
  return <div className={`flex-grow ${className || ''}`}>{children}</div>
}
CardHeader.displayName = 'CardHeader'

interface CardActionsProps {
  children: ReactNode
  className?: string
}

const CardActions: FC<CardActionsProps> = ({ children, className }) => {
  return <div className={`ml-auto h-full ${className || ''}`}>{children}</div>
}
CardActions.displayName = 'CardActions'

interface CardContentProps {
  children: ReactNode
  className?: string
}

const CardContent: FC<CardContentProps> = ({ children, className }) => {
  return (
    <div className={` flex flex-1 flex-col ${className || ''}`}>{children}</div>
  )
}
CardContent.displayName = 'CardContent'

interface CardProps {
  children: ReactNode
  className?: string
}

const Card: FC<CardProps> & {
  Header: FC<CardHeaderProps>
  Actions: FC<CardActionsProps>
  Content: FC<CardContentProps>
} = ({ children, className }) => {
  let headerContent: ReactNode | null = null
  let actionsContent: ReactNode | null = null
  let mainContent: ReactNode | null = null

  Children.forEach(children, child => {
    if (isValidElement(child)) {
      if ((child.type as any).displayName === 'CardHeader') {
        headerContent = child
      } else if ((child.type as any).displayName === 'CardActions') {
        actionsContent = child
      } else if ((child.type as any).displayName === 'CardContent') {
        mainContent = child
      }
    }
  })

  const hasHeaderOrActions = headerContent || actionsContent

  return (
    <div
      className={`bg-background-secondary shadow-md ${className || ''}`}
    >
      {hasHeaderOrActions && (
        <div className="relative flex items-center justify-between border-b border-border-color">
          {headerContent}
          {actionsContent}
        </div>
      )}
      {mainContent}
    </div>
  )
}

Card.Header = CardHeader
Card.Actions = CardActions
Card.Content = CardContent
export { Card }
