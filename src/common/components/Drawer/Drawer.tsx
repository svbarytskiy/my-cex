import { useEffect, useRef, ReactNode, FC, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

type DrawerPosition = 'left' | 'right' | 'bottom'

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  position?: DrawerPosition
  headerContent?: ReactNode
  className?: string
  animationDuration?: number
  triggerRef?: React.RefObject<HTMLElement>
}

export const Drawer: FC<DrawerProps> = ({
  isOpen,
  onClose,
  children,
  position = 'left',
  headerContent,
  className = '',
  animationDuration = 300,
  triggerRef,
}) => {
  const drawerRef = useRef<HTMLDivElement>(null)
  const portalTarget = document.getElementById('portal-root')

  const [shouldRender, setShouldRender] = useState(isOpen)

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
    } else {
      const timer = setTimeout(() => {
        setShouldRender(false)
      }, animationDuration)
      return () => clearTimeout(timer)
    }
  }, [isOpen, animationDuration])

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      const clickedElement = event.target as Node

      if (
        drawerRef.current &&
        !drawerRef.current.contains(clickedElement) &&
        (!triggerRef ||
          (triggerRef.current && !triggerRef.current.contains(clickedElement)))
      ) {
        onClose()
      }
    }

    if (shouldRender) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscapeKey)
      document.body.style.overflow = 'hidden'
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscapeKey)
      document.body.style.overflow = ''
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscapeKey)
      document.body.style.overflow = ''
    }
  }, [shouldRender, isOpen, onClose, triggerRef])

  const getDrawerClasses = (): string => {
    let classes = `fixed transform transition-transform duration-${animationDuration} ease-in-out shadow-lg z-50 bg-background-tertiary flex flex-col`

    if (position === 'left') {
      classes += ' top-0 left-0 h-full w-80'
      classes += isOpen ? ' translate-x-0' : ' -translate-x-full'
    } else if (position === 'right') {
      classes += ' top-0 right-0 h-full w-80'
      classes += isOpen ? ' translate-x-0' : ' translate-x-full'
    } else if (position === 'bottom') {
      classes += ' bottom-0 left-0 w-full h-[80vh] rounded-t-lg'
      classes += isOpen ? ' translate-y-0' : ' translate-y-full'
    }

    return `${classes} ${className}`
  }

  const getOverlayClasses = (): string => {
    return `fixed inset-0 bg-black transition-opacity duration-${animationDuration} ease-in-out z-40 ${
      isOpen
        ? 'opacity-50 pointer-events-auto'
        : 'opacity-0 pointer-events-none'
    }`
  }

  if (!shouldRender || !portalTarget) {
    return null
  }

  return createPortal(
    <>
      <div className={getOverlayClasses()} onClick={onClose} />

      <div ref={drawerRef} className={getDrawerClasses()}>
        <div className="flex items-center justify-between p-4 border-b border-border-color flex-shrink-0">
          <div className="flex-grow">
            {headerContent || (
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                Заголовок Drawer
              </h2>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none cursor-pointer p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Закрити"
          >
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <div className="block flex-1 min-h-0 overflow-y-auto max-h-[90%]">
          {children}
        </div>
      </div>
    </>,
    portalTarget,
  )
}
