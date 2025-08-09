import { FC, useCallback, useRef, useState } from 'react'
import { PriceDisplay } from 'common/components/PriceDisplay'
import { DropdownArrow } from '../DropdownArrow/DropdownArrow'
import { FavoriteStar } from 'common/components/FavoriteStar/FavoriteStar'
import { TickersWatchList } from 'features/tickers-watchlist'
import { ClickAwayListener } from 'common/components/ClickAwayListener/ClickAwayListener'
import { Drawer } from 'common/components/Drawer/Drawer'
import { useDeviceType } from 'common/hooks/useDeviceType'
import {
  selectIsPairFavorite,
  toggleFavoriteStatus,
} from 'app/store/slices/pairSettings/pairSettings.slice'
import { useAppDispatch, useAppSelector } from 'app/store/store'

interface MarketInfoHeaderProps {
  symbol: string
  baseAsset: string
  quoteAsset: string
  price: string
  percentChange: string
}

const MarketInfoHeader: FC<MarketInfoHeaderProps> = ({
  symbol,
  baseAsset,
  quoteAsset,
  price,
  percentChange,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownArrowRef = useRef<HTMLButtonElement>(null)
  const dispatch = useAppDispatch()

  const isFavorite = useAppSelector(state =>
    selectIsPairFavorite(state, symbol),
  )
  const handleFavoriteClick = useCallback(() => {
    dispatch(toggleFavoriteStatus(symbol))
  }, [dispatch, symbol])
  const handleDropdownToggle = useCallback(() => {
    setIsDropdownOpen(prev => !prev)
  }, [])

  const handleCloseTickersWatchList = useCallback(() => {
    setIsDropdownOpen(false)
  }, [])
  const { isMobile, isTablet, isDesktop } = useDeviceType()

  return (
    <div className=" flex flex-col md:flex-row">
      <div className="flex gap-2 items-center mr-2">
        <FavoriteStar
          className="hidden md:block"
          isActive={isFavorite}
          onClick={handleFavoriteClick}
        />
        <h1 className="m-0 text-lg font-semibold leading-6 text-primary">
          {baseAsset}/{quoteAsset}
        </h1>
        <DropdownArrow
          isOpen={isDropdownOpen}
          onClick={handleDropdownToggle}
          ref={dropdownArrowRef}
        />
      </div>
      {isMobile && (
        <Drawer
          isOpen={isDropdownOpen}
          onClose={handleCloseTickersWatchList}
          position="bottom"
          headerContent={
            <h2 className="text-sm text-text-secondary">Market Watchlist</h2>
          }
        >
          <TickersWatchList />
        </Drawer>
      )}

      {!isMobile && (
        <ClickAwayListener
          onOutsideClick={handleCloseTickersWatchList}
          isOpen={isDropdownOpen}
          triggerRef={dropdownArrowRef}
        >
          <div className="absolute top-full z-20 left-0 w-110 h-140 max-h-[85vh]">
            <TickersWatchList />
          </div>
        </ClickAwayListener>
      )}
      <PriceDisplay percentChange={percentChange} price={price} />
    </div>
  )
}

MarketInfoHeader.displayName = 'MarketInfoHeader'

export { MarketInfoHeader }
