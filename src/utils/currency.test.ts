// test('formats 100 USD correctly', () => {
//   expect(formatCurrency(100)).toBe('$100.00');
// });

// test('formats string "100" as USD', () => {
//   expect(formatCurrency("100")).toBe('$100.00');
// });

// test('formats 1000 EUR correctly', () => {
//   expect(formatCurrency(1000, 'EUR')).toBe('€1,000.00');
// });
// test('handles zero', () => {
//   expect(formatCurrency(0)).toBe('$0.00');
// });

// test('handles negative numbers', () => {
//   expect(formatCurrency(-50)).toBe('-$50.00');
// });

// test('handles large numbers', () => {
//   expect(formatCurrency(1_000_000)).toBe('$1,000,000.00');
// });
// test('throws error for null', () => {
//   expect(() => formatCurrency(null)).toThrow('Value cannot be null or undefined');
// });

// test('throws error for undefined', () => {
//   expect(() => formatCurrency(undefined)).toThrow('Value cannot be null or undefined');
// });

// test('throws error for non-numeric string', () => {
//   expect(() => formatCurrency("abc")).toThrow('Invalid number: "abc"');
// });

// test('throws error for empty string', () => {
//   expect(() => formatCurrency("")).toThrow('Invalid number: ""');
// });
// test('formats JPY without decimals', () => {
//   expect(formatCurrency(500, 'JPY')).toBe('¥500');
// });

// test('formats BTC (custom currency)', () => {
//   expect(formatCurrency(0.5, 'BTC')).toBe('BTC0.5'); // Залежить від локалі
// });