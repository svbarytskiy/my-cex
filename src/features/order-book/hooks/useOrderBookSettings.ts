import { useState, useEffect } from 'react'

import { OrderBookView } from '../types'
import { selectTickSizeBySymbol } from 'app/store/slices/exchangeInfo/exchangeInfoSlice'
import { useAppSelector } from 'app/store/store'

export const useOrderBookSettings = (symbol: string) => {
  const [activeView, setActiveView] = useState<OrderBookView>('default')
  const tickSize = useAppSelector(state =>
    selectTickSizeBySymbol(state, symbol),
  )

  const [precision, setPrecision] = useState<number>(() => {
    const parsed = parseFloat(tickSize || '')
    return isNaN(parsed) || parsed <= 0 ? 0.001 : parsed
  })

  useEffect(() => {
    const newParsedTickSize = parseFloat(tickSize || '')
    if (
      !isNaN(newParsedTickSize) &&
      newParsedTickSize > 0 &&
      newParsedTickSize !== precision
    ) {
      setPrecision(newParsedTickSize)
    }
  }, [tickSize])

  const handleViewChange = (view: OrderBookView) => setActiveView(view)
  const handlePrecisionChange = (newPrecision: number) => {
    setPrecision(newPrecision)
  }

  return {
    tickSize: parseFloat(tickSize || '') || 0.001,
    activeView,
    precision,
    handleViewChange,
    handlePrecisionChange,
  }
}
