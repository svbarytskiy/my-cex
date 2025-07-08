import { FC, useCallback, useRef, useState } from 'react'
import styles from './MarketInfoHeader.module.css'
import { PriceDisplay } from 'common/components/PriceDisplay/PriceDisplay'
import { DropdownArrow } from '../DropdownArrow/DropdownArrow'
import { FavoriteStar } from 'common/components/FavoriteStar/FavoriteStar'
import { TickersWatchList } from 'features/tickers-watchlist'

interface MarketInfoHeaderProps {
  symbol: string
  price: string
  onFavoriteClick: () => void
  isFavorite: boolean
}

const MarketInfoHeader: FC<MarketInfoHeaderProps> = ({
  symbol,
  price,
  onFavoriteClick,
  isFavorite,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownArrowRef = useRef<HTMLButtonElement>(null)
  const handleDropdownToggle = useCallback(() => {
    setIsDropdownOpen(prev => !prev)
  }, [])

  const handleCloseTickersWatchList = useCallback(() => {
    setIsDropdownOpen(false)
  }, [])
  return (
    <div className={styles.headerContainer}>
      <FavoriteStar isActive={isFavorite} onClick={onFavoriteClick} />
      <h1 className={styles.pairSymbol}>{symbol}</h1>
      <DropdownArrow
        isOpen={isDropdownOpen}
        onClick={handleDropdownToggle}
        ref={dropdownArrowRef}
      />
      <TickersWatchList
        isOpen={isDropdownOpen}
        onClose={handleCloseTickersWatchList}
        triggerRef={dropdownArrowRef}
      />
      <PriceDisplay price={price} />
    </div>
  )
}

MarketInfoHeader.displayName = 'MarketInfoHeader'

export { MarketInfoHeader }
