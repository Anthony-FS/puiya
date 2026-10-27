import { describe, expect, it } from 'vitest'
import { deriveSyncStatus } from './syncStatus'

describe('deriveSyncStatus', () => {
  it('is synced when online with nothing waiting', () => {
    expect(deriveSyncStatus({ online: true, pendingCount: 0 })).toBe('synced')
  })

  it('is pending when online with records waiting', () => {
    expect(deriveSyncStatus({ online: true, pendingCount: 3 })).toBe('pending')
  })

  it('is offline whenever the phone is offline, waiting records or not', () => {
    expect(deriveSyncStatus({ online: false, pendingCount: 0 })).toBe('offline')
    expect(deriveSyncStatus({ online: false, pendingCount: 12 })).toBe('offline')
  })

  it.each([-1, 1.5, Number.NaN])('rejects an impossible pending count of %s', (pendingCount) => {
    expect(() => deriveSyncStatus({ online: true, pendingCount })).toThrow(RangeError)
  })
})
