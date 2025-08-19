type FormatNumberOptions = {
  locale?: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  useGrouping?: boolean
}

export function formatNumber(
  number: string | number,
  options: FormatNumberOptions = {},
): string {
  const {
    locale = 'en-US',
    minimumFractionDigits = 2,
    useGrouping = true,
  } = options

  const parsed = Number(number)

  if (isNaN(parsed)) return String(number)
  let actualMaximumFractionDigits = options.maximumFractionDigits

  if (actualMaximumFractionDigits === undefined) {
    const numString = parsed.toString()
    const decimalIndex = numString.indexOf('.')
    if (decimalIndex !== -1) {
      actualMaximumFractionDigits = numString.length - 1 - decimalIndex
    } else {
      actualMaximumFractionDigits = 0
    }
    actualMaximumFractionDigits = Math.max(
      actualMaximumFractionDigits,
      minimumFractionDigits,
    )
    actualMaximumFractionDigits = Math.min(actualMaximumFractionDigits, 20)
  }

  return parsed.toLocaleString(locale, {
    minimumFractionDigits,
    maximumFractionDigits: actualMaximumFractionDigits,
    useGrouping,
  })
}
