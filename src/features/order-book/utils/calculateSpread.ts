export const calculateSpread = (bestBid: number, bestAsk: number) => {
  if (bestBid === 0 || bestAsk === 0) {
    return { value: 0, percentage: '0.00' }
  }
  const value = (bestAsk - bestBid)
  const percentage = (((bestAsk - bestBid) / bestBid) * 100).toFixed(2)
  return { value, percentage }
}
