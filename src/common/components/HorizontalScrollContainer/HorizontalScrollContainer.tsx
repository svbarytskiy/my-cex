import {
  FC,
  memo,
  useRef,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react'
import styles from './HorizontalScrollContainer.module.css'
import { ScrollNavButton } from './ScrollNavButton/ScrollNavButton'

interface HorizontalScrollContainerProps {
  children: ReactNode
  scrollAmount?: number
  showNavButtons?: boolean
  itemGap?: number
}

const HorizontalScrollContainer: FC<HorizontalScrollContainerProps> = memo(
  ({ children, scrollAmount = 200, showNavButtons = true }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const [showLeftNav, setShowLeftNav] = useState(false)
    const [showRightNav, setShowRightNav] = useState(false)

    // Оновлення видимості кнопок навігації
    const checkNavButtonVisibility = useCallback(() => {
      const container = scrollContainerRef.current
      if (container) {
        const { scrollWidth, clientWidth, scrollLeft } = container
        // Додаємо невеликий допуск для правої кнопки, щоб уникнути проблем з округленням
        setShowLeftNav(scrollLeft > 0)
        setShowRightNav(scrollLeft + clientWidth < scrollWidth - 1) // -1 для допуску
      }
    }, [])

    // Ефект для перевірки видимості кнопок при завантаженні та зміні розміру
    useEffect(() => {
      checkNavButtonVisibility() // Initial check

      const container = scrollContainerRef.current
      if (container) {
        container.addEventListener('scroll', checkNavButtonVisibility)
        window.addEventListener('resize', checkNavButtonVisibility)
      }

      // Cleanup
      return () => {
        if (container) {
          container.removeEventListener('scroll', checkNavButtonVisibility)
          window.removeEventListener('resize', checkNavButtonVisibility)
        }
      }
    }, [checkNavButtonVisibility])

    // Функція для скролу контейнера
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

    return (
      <div className={styles.scrollContainerWrapper}>
        {showNavButtons && (
          <ScrollNavButton
            direction="left"
            onClick={() => handleScroll('left')}
            isVisible={showLeftNav}
          />
        )}

        <div className={styles.scrollContent} ref={scrollContainerRef}>
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
