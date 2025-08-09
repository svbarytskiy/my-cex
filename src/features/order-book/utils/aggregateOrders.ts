import { DepthLevel } from 'app/store/slices/depth/types'

export const aggregateOrders = (
  orders: DepthLevel[],
  precision: number,
  type: 'bid' | 'ask',
): DepthLevel[] => {
  const aggregated: Record<string, number> = {}

  orders.forEach(([price, quantity]) => {
    const numericPrice = parseFloat(price)
    const numericQuantity = parseFloat(quantity)

    if (isNaN(numericPrice) || isNaN(numericQuantity)) {
      console.warn(
        'Invalid price or quantity encountered during aggregation:',
        price,
        quantity,
      )
      return
    }

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
  ]) as DepthLevel[]

  return type === 'bid'
    ? result.sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]))
    : result.sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]))
}
