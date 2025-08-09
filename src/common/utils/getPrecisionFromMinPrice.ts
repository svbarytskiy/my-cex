export const getPrecisionFromMinPrice = (minPrice: number): number => {
  const s = minPrice.toString()
  if (s.includes('e-')) {
    return parseInt(s.split('e-')[1], 10)
  }
  if (s.includes('.')) {
    return s.split('.')[1].length
  }
  return 0
}
