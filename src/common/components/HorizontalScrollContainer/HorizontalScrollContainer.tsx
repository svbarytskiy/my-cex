import {
  FC,
  memo,
  useRef,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react'
import { ScrollNavButton } from './ScrollNavButton/ScrollNavButton'

interface HorizontalScrollContainerProps {
  children: ReactNode
  scrollAmount?: number
  showNavButtons?: boolean
  itemGap?: number
  scrollToId?: string
}

const HorizontalScrollContainer: FC<HorizontalScrollContainerProps> = memo(
  ({
    children,
    scrollAmount = 200,
    showNavButtons = true,
    itemGap,
    scrollToId,
  }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const [showLeftNav, setShowLeftNav] = useState(false)
    const [showRightNav, setShowRightNav] = useState(false)

    const checkNavButtonVisibility = useCallback(() => {
      const container = scrollContainerRef.current
      if (container) {
        const { scrollWidth, clientWidth, scrollLeft } = container
        setShowLeftNav(scrollLeft > 0)
        setShowRightNav(scrollLeft + clientWidth < scrollWidth - 1)
      }
    }, [])

    useEffect(() => {
      checkNavButtonVisibility()

      const container = scrollContainerRef.current
      if (container) {
        container.addEventListener('scroll', checkNavButtonVisibility)
        window.addEventListener('resize', checkNavButtonVisibility)
      }

      return () => {
        if (container) {
          container.removeEventListener('scroll', checkNavButtonVisibility)
          window.removeEventListener('resize', checkNavButtonVisibility)
        }
      }
    }, [checkNavButtonVisibility])

    useEffect(() => {
      if (scrollToId && scrollContainerRef.current) {
        const targetElement = scrollContainerRef.current.querySelector(
          `#${scrollToId}`,
        )
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center',
          })
        }
      }
    }, [scrollToId])

    const handleScroll = useCallback(
      (direction: 'left' | 'right') => {
        const container = scrollContainerRef.current
        if (container) {
          const scrollBy = direction === 'left' ? -scrollAmount : scrollAmount
          container.scrollBy({ left: scrollBy, behavior: 'smooth' })
        }
      },
      [scrollAmount],
    )

    const gapClass = itemGap !== undefined ? `gap-[${itemGap}px]` : ''

    return (
      <div className="relative w-full overflow-hidden box-border">
        {showNavButtons && (
          <ScrollNavButton
            direction="left"
            onClick={() => handleScroll('left')}
            isVisible={showLeftNav}
          />
        )}
        <div
          className={`flex overflow-x-auto custom-scrollbar-hide ${gapClass}`}
          ref={scrollContainerRef}
        >
          {children}
        </div>
        {showNavButtons && (
          <ScrollNavButton
            direction="right"
            onClick={() => handleScroll('right')}
            isVisible={showRightNav}
          />
        )}
      </div>
    )
  },
)

HorizontalScrollContainer.displayName = 'HorizontalScrollContainer'

export { HorizontalScrollContainer }
