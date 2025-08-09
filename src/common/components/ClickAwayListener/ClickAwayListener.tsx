import { FC, ReactNode, RefObject, useEffect, useRef } from 'react'

interface ClickAwayListenerProps {
  onOutsideClick: () => void
  children: ReactNode
  isOpen?: boolean
  triggerRef?: RefObject<HTMLElement | null>
}

const ClickAwayListener: FC<ClickAwayListenerProps> = ({
  onOutsideClick,
  children,
  isOpen,
  triggerRef,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handleClickOutside = (event: MouseEvent) => {
      const clickedElement = event.target as Node
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(clickedElement) &&
        (!triggerRef ||
          (triggerRef.current && !triggerRef.current.contains(clickedElement)))
      ) {
        onOutsideClick()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onOutsideClick, triggerRef, isOpen])

  if (!isOpen) return null
  return <div ref={wrapperRef}>{children}</div>
}
export { ClickAwayListener }
