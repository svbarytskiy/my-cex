interface FormatLargeNumberOptions {
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  locale?: string
  signDisplay?: 'auto' | 'never' | 'always' | 'exceptZero'
  defaultSmallNumberFractionDigits?: number
}

export function formatLargeNumber(
  num: number | string | null | undefined,
  options?: FormatLargeNumberOptions,
): string {
  if (num === null || num === undefined || num === '') {
    return '0'
  }

  const numberValue = typeof num === 'string' ? parseFloat(num) : num

  if (isNaN(numberValue)) {
    return '0'
  }

  const defaultOptions: FormatLargeNumberOptions = {
    locale: 'en-US',
    signDisplay: 'auto',
  }

  const mergedOptions = { ...defaultOptions, ...options }
  const { locale, signDisplay } = mergedOptions

  const units = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'K' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'B' },
    { value: 1e12, symbol: 'T' },
  ]

  const unit =
    units
      .slice()
      .reverse()
      .find(u => Math.abs(numberValue) >= u.value) || units[0]

  let formattedNum: number
  let finalSymbol: string = ''
  let finalMinFractionDigits: number | undefined
  let finalMaxFractionDigits: number | undefined

  if (unit.value === 1) {
    formattedNum = numberValue
    finalSymbol = ''

    if (options?.minimumFractionDigits !== undefined) {
      finalMinFractionDigits = options.minimumFractionDigits
    } else if (options?.defaultSmallNumberFractionDigits !== undefined) {
      finalMinFractionDigits = options.defaultSmallNumberFractionDigits
    }

    if (options?.maximumFractionDigits !== undefined) {
      finalMaxFractionDigits = options.maximumFractionDigits
    } else if (options?.defaultSmallNumberFractionDigits !== undefined) {
      finalMaxFractionDigits = options.defaultSmallNumberFractionDigits
    }
  } else {
    formattedNum = numberValue / unit.value
    finalSymbol = unit.symbol
    finalMinFractionDigits = 2
    finalMaxFractionDigits = 2
  }

  const formatterOptions: Intl.NumberFormatOptions = {
    useGrouping: true,
    signDisplay: signDisplay,
  }

  if (finalMinFractionDigits !== undefined) {
    formatterOptions.minimumFractionDigits = finalMinFractionDigits
  }
  if (finalMaxFractionDigits !== undefined) {
    formatterOptions.maximumFractionDigits = finalMaxFractionDigits
  }

  const formatter = new Intl.NumberFormat(locale, formatterOptions)

  return formatter.format(formattedNum) + finalSymbol
}
