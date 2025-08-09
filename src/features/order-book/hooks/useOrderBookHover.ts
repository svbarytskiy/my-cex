import { useState, RefObject } from 'react'
import { HoverInfo, Order, AggregatedData } from '../types'


export const useOrderBookHover = (
  containerRef: RefObject<HTMLElement | null>,
) => {
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null)

  const handleRowHover = (
    price: string,
    type: 'ask' | 'bid',
    rowEl: HTMLElement,
    index: number,
  ) => {
    if (!containerRef.current) return

    const containerRect = containerRef.current.getBoundingClientRect()
    const rowRect = rowEl.getBoundingClientRect()

    let yOffset = rowRect.top - containerRect.top
    if (type === 'bid') {
      yOffset += 20
    }
    const xOffset = rowRect.right
    const yPosition = rowEl.offsetTop

    setHoverInfo({ price, type, yOffset, yPosition, xOffset, index })
  }

  const handleRowLeave = () => setHoverInfo(null)

  const calculateAggregatedData = (
    orders: Order[],
    hoverInfo: HoverInfo | null,
  ): AggregatedData | null => {
    if (!hoverInfo || !orders || orders.length === 0) return null

    let slice: Order[] = []

    if (hoverInfo.type === 'ask') {
      slice = orders.slice(hoverInfo.index)
    } else {
      slice = orders.slice(0, hoverInfo.index + 1)
    }

    if (slice.length === 0) return null

    const totalQuantity = slice.reduce(
      (sum, o) => sum + parseFloat(o.quantity),
      0,
    )
    const sumPrices = slice.reduce((sum, o) => sum + parseFloat(o.price), 0)
    const avgPrice = sumPrices / slice.length

    const quoteSum = totalQuantity * avgPrice

    return {
      avgPrice: avgPrice,
      total: totalQuantity,
      quoteSum: quoteSum,
    }
  }

  return {
    hoverInfo,
    handleRowHover,
    handleRowLeave,
    calculateAggregatedData,
  }
}
