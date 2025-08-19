import { formatPercent } from './format'

describe('formatPercent', () => {
  test('should format a positive number with default options (2 decimals, show plus sign)', () => {
    expect(formatPercent(12.345)).toBe('+12.35%')
    expect(formatPercent(5)).toBe('+5.00%')
  })

  test('should format a negative number with default options', () => {
    expect(formatPercent(-12.345)).toBe('-12.35%')
    expect(formatPercent(-5)).toBe('-5.00%')
  })

  test('should format zero with default options', () => {
    expect(formatPercent(0)).toBe('+0.00%')
  })

  test('should format a positive string number with default options', () => {
    expect(formatPercent('12.345')).toBe('+12.35%')
  })

  test('should format a negative string number with default options', () => {
    expect(formatPercent('-67.891')).toBe('-67.89%')
  })

  test('should format with specified number of decimals', () => {
    expect(formatPercent(12.34567, { decimals: 0 })).toBe('+12%')
    expect(formatPercent(12.34567, { decimals: 1 })).toBe('+12.3%')
    expect(formatPercent(12.34567, { decimals: 3 })).toBe('+12.346%')
    expect(formatPercent(12, { decimals: 4 })).toBe('+12.0000%')
  })

  test('should not show plus sign when showPlusSign is false for positive numbers', () => {
    expect(formatPercent(10.5, { showPlusSign: false })).toBe('10.50%')
  })

  test('should still show minus sign when showPlusSign is false for negative numbers', () => {
    expect(formatPercent(-10.5, { showPlusSign: false })).toBe('-10.50%')
  })

  test('should not show plus sign when showPlusSign is false for zero', () => {
    expect(formatPercent(0, { showPlusSign: false })).toBe('0.00%')
  })

  test('should trim trailing zeros when trimTrailingZeros is true', () => {
    expect(formatPercent(12.0, { trimTrailingZeros: true })).toBe('+12%')
    expect(formatPercent(12.3, { trimTrailingZeros: true })).toBe('+12.3%')
    expect(formatPercent(12.34, { trimTrailingZeros: true, decimals: 3 })).toBe(
      '+12.34%',
    )
  })

  test('should not trim non-zero trailing digits when trimTrailingZeros is true', () => {
    expect(formatPercent(12.34, { trimTrailingZeros: true })).toBe('+12.34%')
  })

  test('should trim trailing zeros and show plus sign', () => {
    expect(formatPercent(10.0, { decimals: 0, trimTrailingZeros: true })).toBe(
      '+10%',
    )
    expect(formatPercent(10.5, { trimTrailingZeros: true, decimals: 1 })).toBe(
      '+10.5%',
    )
  })

  test('should trim trailing zeros and not show plus sign', () => {
    expect(
      formatPercent(10.0, {
        decimals: 0,
        trimTrailingZeros: true,
        showPlusSign: false,
      }),
    ).toBe('10%')
    expect(
      formatPercent(10.5, {
        trimTrailingZeros: true,
        decimals: 1,
        showPlusSign: false,
      }),
    ).toBe('10.5%')
  })

  test('should return "0.00%" for NaN', () => {
    expect(formatPercent(NaN)).toBe('0.00%')
    expect(formatPercent('not a number')).toBe('0.00%')
  })

  test('should return "0.00%" for Infinity', () => {
    expect(formatPercent(Infinity)).toBe('0.00%')
  })

  test('should return "0.00%" for -Infinity', () => {
    expect(formatPercent(-Infinity)).toBe('0.00%')
  })

  test('should handle all options combined (positive number)', () => {
    const options = {
      decimals: 1,
      showPlusSign: false,
      trimTrailingZeros: true,
    }
    expect(formatPercent(12.345, options)).toBe('12.3%')
    expect(formatPercent(12.0, options)).toBe('12%')
  })

  test('should handle all options combined (negative number)', () => {
    const options = {
      decimals: 1,
      showPlusSign: false,
      trimTrailingZeros: true,
    }
    expect(formatPercent(-12.345, options)).toBe('-12.3%')
    expect(formatPercent(-12.0, options)).toBe('-12%')
  })
})
