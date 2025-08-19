import { formatNumber } from './number'

describe('formatNumber', () => {
  test('should format a number with default options', () => {
    expect(formatNumber(1234.567)).toBe('1,234.567')
    expect(formatNumber(1234)).toBe('1,234.00')
    expect(formatNumber(1234.5)).toBe('1,234.50')
  })

  test('should format zero with default options', () => {
    expect(formatNumber(0)).toBe('0.00')
  })

  test('should format a negative number with default options', () => {
    expect(formatNumber(-1234.567)).toBe('-1,234.567')
  })

  test('should format a string number with default options', () => {
    expect(formatNumber('5678.123')).toBe('5,678.123')
    expect(formatNumber('100')).toBe('100.00')
  })

  test('should return original string for non-numeric string input', () => {
    expect(formatNumber('abc')).toBe('abc')
    expect(formatNumber('Not a Number')).toBe('Not a Number')
  })

  test('should return "NaN" for NaN input', () => {
    expect(formatNumber(NaN)).toBe('NaN')
  })

  test('should format with a specified locale (de-DE)', () => {
    expect(formatNumber(1234.567, { locale: 'de-DE' })).toBe('1.234,567')
  })

  test('should format with a specified locale (fr-FR) for integer', () => {
    expect(formatNumber(5000, { locale: 'fr-FR' })).toBe('5 000,00')
  })

  test('should use specified minimumFractionDigits', () => {
    expect(formatNumber(12.3, { minimumFractionDigits: 3 })).toBe('12.300')
    expect(formatNumber(123, { minimumFractionDigits: 5 })).toBe('123.00000')
  })

  test('should use specified maximumFractionDigits when provided', () => {
    expect(formatNumber(123.4567, { maximumFractionDigits: 2 })).toBe('123.46')
    expect(formatNumber(123.999, { maximumFractionDigits: 2 })).toBe('124.00')
    expect(
      formatNumber(123.456, {
        maximumFractionDigits: 5,
        minimumFractionDigits: 2,
      }),
    ).toBe('123.456')
  })

  test('should not use grouping when useGrouping is false', () => {
    expect(formatNumber(1234567.89, { useGrouping: false })).toBe('1234567.89')
  })

  test('should use grouping when useGrouping is true (default)', () => {
    expect(formatNumber(1234567.89, { useGrouping: true })).toBe('1,234,567.89')
    expect(formatNumber(1234567.89)).toBe('1,234,567.89')
  })

  test('should infer maximumFractionDigits from input if not provided', () => {
    expect(formatNumber(1.23456)).toBe('1.23456')
    expect(formatNumber(123)).toBe('123.00')
    expect(formatNumber(1.2345678901234567)).toBe('1.2345678901234567')
  })

  test('should infer maximumFractionDigits correctly for string inputs', () => {
    expect(formatNumber('1.2345')).toBe('1.2345')
    expect(formatNumber('100')).toBe('100.00')
    expect(formatNumber('12.3000')).toBe('12.30')
  })

  test('should respect minimumFractionDigits even with inferred maximumFractionDigits', () => {
    expect(formatNumber(123, { minimumFractionDigits: 3 })).toBe('123.000')
    expect(formatNumber(123.4, { minimumFractionDigits: 3 })).toBe('123.400')
  })
})
