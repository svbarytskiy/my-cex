import { createSelector } from '@reduxjs/toolkit'
import { selectBidsArray, selectAsksArray } from './depthSlice'

export const selectOrderBookData = createSelector(
  [selectBidsArray, selectAsksArray],
  (bidsArray, asksArray) => {
    return {
      bids: bidsArray,
      asks: asksArray,
    }
  },
)

export const selectBestBidAsk = createSelector(
  [selectBidsArray, selectAsksArray],
  (bids, asks) => {
    const bestBid = bids.length > 0 ? parseFloat(bids[0][0]) : 0
    const bestAsk = asks.length > 0 ? parseFloat(asks[0][0]) : 0
    return { bestBid, bestAsk }
  },
)

export const selectSpread = createSelector(
  [selectBestBidAsk],
  ({ bestBid, bestAsk }) => {
    if (bestBid === 0 || bestAsk === 0) {
      return { value: '0.00', percentage: '0.00' }
    }
    const value = (bestAsk - bestBid).toFixed(2)
    const percentage = (((bestAsk - bestBid) / bestBid) * 100).toFixed(2)
    return { value, percentage }
  },
)

export const selectTotalBidVolume = createSelector([selectBidsArray], bids => {
  return bids.reduce((acc, [, quantity]) => acc + parseFloat(quantity), 0)
})

export const selectTotalAskVolume = createSelector([selectAsksArray], asks => {
  return asks.reduce((acc, [, quantity]) => acc + parseFloat(quantity), 0)
})

export const selectMaxQuantity = createSelector(
  [selectBidsArray, selectAsksArray],
  (bids, asks) => {
    const maxBid =
      bids.length > 0
        ? Math.max(...bids.map(([, quantity]) => parseFloat(quantity)))
        : 0
    const maxAsk =
      asks.length > 0
        ? Math.max(...asks.map(([, quantity]) => parseFloat(quantity)))
        : 0
    return Math.max(maxBid, maxAsk)
  },
)
