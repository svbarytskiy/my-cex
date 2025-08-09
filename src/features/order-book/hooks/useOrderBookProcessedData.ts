import { useMemo } from 'react'
import { DepthLevel } from '../../../app/store/slices/depth/types'
import { TotalColumnType, TotalColumnCurrency, ProcessedOrder } from '../types'
import { aggregateOrders } from '../utils/aggregateOrders'
import { calculateSpread } from '../utils/calculateSpread'
import { processOrders } from '../utils/processOrders'

export const useProcessedOrderData = (
  rawBids: DepthLevel[],
  rawAsks: DepthLevel[],
  precision: number,
  totalColumnType: TotalColumnType,
  totalColumnCurrency: TotalColumnCurrency,
  currentPrice: number,
) => {
  const { bids, asks } = useMemo(() => {
    const aggregatedBids = aggregateOrders(rawBids, precision, 'bid')
    const aggregatedAsks = aggregateOrders(rawAsks, precision, 'ask')
    return {
      bids: aggregatedBids,
      asks: aggregatedAsks,
    }
  }, [rawBids, rawAsks, precision])

  const processedBids: ProcessedOrder[] = useMemo(
    () =>
      processOrders(bids, totalColumnType, totalColumnCurrency, currentPrice),
    [bids, totalColumnType, totalColumnCurrency, currentPrice],
  )
  const processedAsks: ProcessedOrder[] = useMemo(
    () =>
      processOrders(asks, totalColumnType, totalColumnCurrency, currentPrice),
    [asks, totalColumnType, totalColumnCurrency, currentPrice],
  )

  const spread = useMemo(() => {
    const bestRawBid = rawBids[0] ? parseFloat(rawBids[0][0]) : 0
    const bestRawAsk = rawAsks[0] ? parseFloat(rawAsks[0][0]) : 0
    return calculateSpread(bestRawBid, bestRawAsk)
  }, [rawBids, rawAsks])

  const totalBidVolume = useMemo(
    () => rawBids.reduce((acc, [, quantity]) => acc + parseFloat(quantity), 0),
    [rawBids],
  )

  const totalAskVolume = useMemo(
    () => rawAsks.reduce((acc, [, quantity]) => acc + parseFloat(quantity), 0),
    [rawAsks],
  )

  const totalVolume = totalBidVolume + totalAskVolume
  const buyPercentage =
    totalVolume > 0 ? ((totalBidVolume / totalVolume) * 100).toFixed(1) : '0.0'

  const maxQuantity = useMemo(() => {
    const maxProcessedBid =
      processedBids.length > 0
        ? Math.max(...processedBids.map(item => parseFloat(item.total)))
        : 0
    const maxProcessedAsk =
      processedAsks.length > 0
        ? Math.max(...processedAsks.map(item => parseFloat(item.total)))
        : 0

    return Math.max(maxProcessedBid, maxProcessedAsk)
  }, [processedBids, processedAsks])

  return {
    processedBids,
    processedAsks,
    spread,
    buyPercentage,
    maxQuantity,
    totalBidVolume,
    totalAskVolume,
  }
}
