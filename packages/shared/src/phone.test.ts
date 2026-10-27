import { describe, expect, it } from 'vitest'
import { formatThaiMobile, normaliseThaiMobile } from './phone'

describe('normaliseThaiMobile', () => {
  it.each([
    ['0812345678', '+66812345678'],
    ['081-234-5678', '+66812345678'],
    ['081 234 5678', '+66812345678'],
    ['+66812345678', '+66812345678'],
    ['+66 81 234 5678', '+66812345678'],
    ['66912345678', '+66912345678'],
    ['0612345678', '+66612345678'],
  ])('normalises %s', (input, expected) => {
    expect(normaliseThaiMobile(input)).toBe(expected)
  })

  it.each(['021234567', '0712345678', '081234567', '08123456789', 'abc', ''])(
    'rejects %j',
    (input) => {
      expect(normaliseThaiMobile(input)).toBeNull()
    },
  )
})

describe('formatThaiMobile', () => {
  it('formats for display', () => {
    expect(formatThaiMobile('+66812345678')).toBe('081-234-5678')
  })
})
