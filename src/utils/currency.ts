export function formatCurrency(
  value: number | string,
  currency = 'USD',
): string {
  if (value === null || value === undefined) {
    throw new Error('Value cannot be null or undefined')
  }

  const numericValue = Number(value)

  if (isNaN(numericValue)) {
    throw new Error(`Invalid number: "${value}"`)
  }

  return numericValue.toLocaleString('en-US', {
    style: 'currency',
    currency,
  })
}
