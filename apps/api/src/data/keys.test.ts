import { describe, expect, it } from 'vitest'
import { parseSk, recordSk, shopPk, syncKey, tableNames } from './keys'

const SHOP = '0b9f4a52-5c8e-4c3a-9d55-3f1a2b6c7d8e'
const ID = '6A1D2E3F-4B5C-4D7E-8F90-A1B2C3D4E5F6'

describe('shopPk', () => {
  it('builds the shop partition key in lower case', () => {
    expect(shopPk(SHOP.toUpperCase())).toBe(`SHOP#${SHOP}`)
  })

  it.each(['', 'shop-1', `${SHOP}#x`, 'SHOP#abc'])('rejects %j', (value) => {
    expect(() => shopPk(value)).toThrow(RangeError)
  })
})

describe('recordSk and parseSk', () => {
  it('round-trips every record kind', () => {
    for (const kind of ['PRODUCT', 'SALE', 'STOCK', 'CREDIT', 'CUSTOMER'] as const) {
      const sk = recordSk(kind, ID)
      expect(sk).toBe(`${kind}#${ID.toLowerCase()}`)
      expect(parseSk(sk)).toEqual({ kind, id: ID.toLowerCase() })
    }
  })

  it('handles the shop META record', () => {
    expect(recordSk('META')).toBe('META')
    expect(parseSk('META')).toEqual({ kind: 'META', id: null })
  })

  it('refuses an id on META and a missing id elsewhere', () => {
    expect(() => recordSk('META', ID)).toThrow(RangeError)
    expect(() => recordSk('SALE')).toThrow(RangeError)
  })

  it.each(['SALE', 'SALE#', 'SALE#not-a-uuid', `UNKNOWN#${ID}`, `SALE#${ID}#extra`])(
    'rejects malformed sort key %j',
    (sk) => {
      expect(() => parseSk(sk)).toThrow(RangeError)
    },
  )
})

describe('syncKey', () => {
  it('orders records by time, then by sort key', () => {
    const a = syncKey('2026-10-27T06:00:00.000Z', recordSk('SALE', ID))
    const b = syncKey('2026-10-27T06:00:00.001Z', recordSk('PRODUCT', ID))
    const c = syncKey('2026-10-28T00:00:00.000Z', recordSk('CREDIT', ID))
    expect([c, a, b].sort()).toEqual([a, b, c])
  })

  it.each(['2026-10-27T06:00:00Z', '2026-10-27 06:00:00.000Z', '2026-10-27T13:00:00.000+07:00'])(
    'rejects timestamps that would sort wrongly: %j',
    (updatedAt) => {
      expect(() => syncKey(updatedAt, 'META')).toThrow(RangeError)
    },
  )
})

describe('tableNames', () => {
  it('names tables per stage', () => {
    expect(tableNames.main('staging')).toBe('puiya-staging-main')
    expect(tableNames.people('prod')).toBe('puiya-prod-people')
  })
})
