import { FC, ReactNode, RefObject, useEffect, useRef } from 'react'

interface ClickAwayListenerProps {
  onOutsideClick: () => void
  children: ReactNode
  isOpen?: boolean
  triggerRef?: RefObject<HTMLButtonElement | null>
}

const ClickAwayListener: FC<ClickAwayListenerProps> = ({
  onOutsideClick,
  children,
  isOpen,
  triggerRef,
}) => {
  if (!isOpen) return null
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
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
  }, [onOutsideClick, triggerRef])
  return <div ref={wrapperRef}>{children}</div>
}
export { ClickAwayListener }
