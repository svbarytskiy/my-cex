import { DepthLevel } from 'app/store/slices/depth/types'
import { ProcessedOrder, TotalColumnCurrency, TotalColumnType } from '../types'

export const processOrders = (
  orders: DepthLevel[],
  totalColumnType: TotalColumnType,
  totalColumnCurrency: TotalColumnCurrency,
  currentPrice: number,
): ProcessedOrder[] => {
  let runningTotal = 0
  return orders.map(([price, quantity]) => {
    const numericQuantity = parseFloat(quantity)

    let total: number
    if (totalColumnType === 'cumulative-sum') {
      runningTotal += numericQuantity
      total = runningTotal
    } else {
      total = numericQuantity
    }

    let displayTotal = total
    if (totalColumnCurrency === 'quote' && currentPrice > 0) {
      displayTotal = total * currentPrice
    }

    return {
      price,
      quantity,
      //add formater
      total: displayTotal.toFixed(6),
    }
  })
}
