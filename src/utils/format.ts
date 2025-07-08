type FormatPercentOptions = {
  decimals?: number
  showPlusSign?: boolean
  trimTrailingZeros?: boolean
}

export function formatPercent(
  value: string | number,
  options: FormatPercentOptions = {},
): string {
  const {
    decimals = 2,
    showPlusSign = true,
    trimTrailingZeros = false,
  } = options

  const num = typeof value === 'string' ? parseFloat(value) : value

  if (!isFinite(num)) return '0.00%'

  let fixed = num.toFixed(decimals)

  if (trimTrailingZeros) {
    // remove unnecessary .00 or .10 → .1
    fixed = parseFloat(fixed).toString()
  }

  const sign = num > 0 && showPlusSign ? '+' : ''

  return `${sign}${fixed}%`
}
