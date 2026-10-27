import { describe, expect, it } from 'vitest'
import { addSatang, formatBaht, lineTotal, parseBaht, satang } from './money'

describe('parseBaht', () => {
  it.each([
    ['1250', 125000],
    ['1,250', 125000],
    ['1250.5', 125050],
    ['1250.50', 125050],
    ['฿99.00', 9900],
    ['  0.01 ', 1],
    ['-20', -2000],
  ])('parses %s as %i satang', (input, expected) => {
    expect(parseBaht(input)).toBe(expected)
  })

  it.each(['', 'abc', '1.234', '1.2.3', '฿', '12,34a'])('rejects %j', (input) => {
    expect(() => parseBaht(input)).toThrow(RangeError)
  })
})

describe('formatBaht', () => {
  it('formats with thousands separators and two decimals', () => {
    expect(formatBaht(satang(125050))).toBe('฿1,250.50')
    expect(formatBaht(satang(0))).toBe('฿0.00')
  })
})

describe('satang', () => {
  it('rejects fractional values', () => {
    expect(() => satang(1.5)).toThrow(RangeError)
  })
})

describe('addSatang', () => {
  it('adds without floating-point drift', () => {
    expect(addSatang(satang(10), satang(20))).toBe(30)
    expect(addSatang()).toBe(0)
  })
})

describe('lineTotal', () => {
  it('multiplies and rounds to the nearest satang', () => {
    expect(lineTotal(satang(4500), 2)).toBe(9000)
    // 2.5 kg at ฿33.33/kg = ฿83.325 → ฿83.33
    expect(lineTotal(satang(3333), 2.5)).toBe(8333)
  })

  it('rejects zero, negative or non-finite quantities', () => {
    expect(() => lineTotal(satang(100), 0)).toThrow(RangeError)
    expect(() => lineTotal(satang(100), -1)).toThrow(RangeError)
    expect(() => lineTotal(satang(100), Number.NaN)).toThrow(RangeError)
  })

  it('rejects a negative unit price', () => {
    expect(() => lineTotal(satang(-100), 1)).toThrow(RangeError)
  })
})
