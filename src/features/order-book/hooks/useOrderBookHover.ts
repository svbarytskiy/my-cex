import { useState, RefObject } from 'react'

interface Order {
  price: string
  quantity: string
  total: string
}

interface HoverInfo {
  price: string
  type: 'ask' | 'bid'
  yOffset: number
  xOffset: number
  yPosition: number
  index: number
}

interface AggregatedData {
  avgPrice: string
  total: string
  count: number
}

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

    const scrollTop = containerRef.current.scrollTop
    // const scrollLeft = containerRef.current.scrollLeft

    // Позиція відносно контейнера з урахуванням скролу
    const yPosition =
      type === 'ask'
        ? rowEl.offsetTop
        : rowRect.bottom - containerRect.top + scrollTop

    const yOffset =
      type === 'ask'
        ? rowRect.top - containerRect.top
        : rowRect.bottom - containerRect.top

    const xOffset = rowRect.right

    setHoverInfo({ price, type, yOffset, yPosition, xOffset, index })
  }

  const handleRowLeave = () => setHoverInfo(null)

  const calculateAggregatedData = (
    orders: Order[],
    hoverInfo: HoverInfo | null,
  ): AggregatedData | null => {
    if (!hoverInfo) return null

    const slice =
      hoverInfo.type === 'ask'
        ? orders.slice(hoverInfo.index)
        : orders.slice(0, hoverInfo.index + 1)

    const total = slice.reduce((sum, o) => sum + parseFloat(o.quantity), 0)
    const avg =
      slice.reduce((sum, o) => sum + parseFloat(o.price), 0) / slice.length

    return {
      avgPrice: parseFloat(avg.toFixed(2)).toLocaleString(),
      total: parseFloat(total.toFixed(6)).toLocaleString(),
      count: slice.length,
    }
  }

  return {
    hoverInfo,
    handleRowHover,
    handleRowLeave,
    calculateAggregatedData,
  }
}
