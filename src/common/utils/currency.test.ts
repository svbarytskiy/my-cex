import { formatCurrency } from "./currency"

describe('formatCurrency', () => {
  test('should format a number as USD currency by default', () => {
    const result = formatCurrency(1234.56)
    expect(result).toBe('$1,234.56')
  })

  test('should format a number as specified currency (EUR)', () => {
    const result = formatCurrency(789.12, 'EUR')
    expect(result).toBe('€789.12')
  })

  test('should format a number as specified currency (GBP)', () => {
    const result = formatCurrency(99.99, 'GBP')
    expect(result).toBe('£99.99')
  })

  test('should format an integer correctly', () => {
    const result = formatCurrency(5000)
    expect(result).toBe('$5,000.00')
  })

  test('should format zero correctly', () => {
    const result = formatCurrency(0)
    expect(result).toBe('$0.00')
  })

  test('should format negative numbers correctly', () => {
    const result = formatCurrency(-123.45)
    expect(result).toBe('-$123.45')
  })

  test('should format a string number as currency', () => {
    const result = formatCurrency('100.25')
    expect(result).toBe('$100.25')
  })

  test('should throw an error for null value', () => {
    // @ts-ignore
    expect(() => formatCurrency(null)).toThrow(
      'Value cannot be null or undefined',
    )
  })

  test('should throw an error for undefined value', () => {
    // @ts-ignore: 
    expect(() => formatCurrency(undefined)).toThrow(
      'Value cannot be null or undefined',
    )
  })

  test('should throw an error for non-numeric string', () => {
    expect(() => formatCurrency('abc')).toThrow('Invalid number: "abc"')
  })

  test('should throw an error for NaN', () => {
    expect(() => formatCurrency(NaN)).toThrow('Invalid number: "NaN"')
  })
})
