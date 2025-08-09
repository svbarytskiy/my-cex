import { useEffect, useMemo } from 'react'
import { selectOrderBookData } from 'app/store/slices/depth/depthSelectors'
import { useAppSelector } from 'app/store/store'

const calculateSpread = (bestBid: number, bestAsk: number) => {
  return {
    value: (bestAsk - bestBid).toFixed(2),
    percentage: (((bestAsk - bestBid) / bestBid) * 100).toFixed(2),
  }
}

const aggregateOrders = (
  orders: string[][],
  precision: number,
  type: 'bid' | 'ask',
): string[][] => {
  const aggregated: Record<string, number> = {}

  orders.forEach(([price, quantity]) => {
    const numericPrice = parseFloat(price)
    const numericQuantity = parseFloat(quantity)

    let roundedPrice: number
    if (type === 'bid') {
      roundedPrice = Math.floor(numericPrice / precision) * precision
    } else {
      roundedPrice = Math.ceil(numericPrice / precision) * precision
    }
    const priceKey = roundedPrice.toFixed(8)

    aggregated[priceKey] = (aggregated[priceKey] || 0) + numericQuantity
  })

  const result = Object.entries(aggregated).map(([price, quantity]) => [
    price,
    quantity.toString(),
  ])

  return type === 'bid'
    ? result.sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]))
    : result.sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]))
}

const processOrders = (orders: string[][]) => {
  let runningTotal = 0
  return orders.map(([price, quantity]) => {
    runningTotal += parseFloat(quantity)
    return { price, quantity, total: runningTotal.toFixed(6) }
  })
}

export const useOrderBook = (precision: number) => {
  const price = useAppSelector((state: any) => state.ticker.price)
  const { loading, error, wsConnected } = useAppSelector(state => state.depth)
  const { bids: rawBids, asks: rawAsks } = useAppSelector(selectOrderBookData)

  const processingStartTime = performance.now()

  const { bids, asks, spread } = useMemo(() => {
    const aggregatedBids = aggregateOrders(rawBids, precision, 'bid')
    const aggregatedAsks = aggregateOrders(rawAsks, precision, 'ask')

    const bestBid = aggregatedBids[0] ? parseFloat(aggregatedBids[0][0]) : 0
    const bestAsk = aggregatedAsks[0] ? parseFloat(aggregatedAsks[0][0]) : 0

    return {
      bids: aggregatedBids,
      asks: aggregatedAsks,
      spread: calculateSpread(bestBid, bestAsk),
    }
  }, [rawBids, rawAsks, precision])

  const processedBids = useMemo(() => processOrders(bids), [bids])
  const processedAsks = useMemo(() => processOrders(asks), [asks])

  const totalBidVolume = useMemo(
    () => bids.reduce((acc, [_, quantity]) => acc + parseFloat(quantity), 0),
    [bids],
  )

  const totalAskVolume = useMemo(
    () => asks.reduce((acc, [_, quantity]) => acc + parseFloat(quantity), 0),
    [asks],
  )

  const totalVolume = totalBidVolume + totalAskVolume
  const buyPercentage = ((totalBidVolume / totalVolume) * 100).toFixed(1)

  const maxQuantity = useMemo(() => {
    const maxBid = Math.max(...bids.map(([, quantity]) => parseFloat(quantity)))
    const maxAsk = Math.max(...asks.map(([, quantity]) => parseFloat(quantity)))
    return Math.max(maxBid, maxAsk)
  }, [bids, asks])

  const processingEndTime = performance.now()
  const totalProcessingTime = processingEndTime - processingStartTime

  useEffect(() => {
    if (rawBids.length > 0 || rawAsks.length > 0) {
      console.log(
        `OrderBook UI Processing Time: ${totalProcessingTime.toFixed(2)} ms`,
      )
    }
  }, [totalProcessingTime, rawBids, rawAsks])

  return {
    loading,
    error,
    price,
    processedBids,
    processedAsks,
    spread,
    maxQuantity,
    buyPercentage,
    wsConnected,
  }
}
