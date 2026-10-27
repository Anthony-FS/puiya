import { describe, expect, it } from 'vitest'
import { formatThaiDate, formatThaiDateTime, toBuddhistYear } from './date'

describe('toBuddhistYear', () => {
  it('adds 543', () => {
    expect(toBuddhistYear(2026)).toBe(2569)
  })
})

describe('Thai date formatting', () => {
  // 06:00 UTC is 13:00 in Bangkok.
  const date = new Date('2026-10-27T06:00:00Z')

  it('shows the Buddhist-era year and Thai month', () => {
    const text = formatThaiDate(date)
    expect(text).toContain('2569')
    expect(text).toContain('ต.ค.')
    expect(text).toContain('27')
  })

  it('converts to Bangkok time', () => {
    expect(formatThaiDateTime(date)).toContain('13:00')
  })

  it('rolls over to the next day in Bangkok when UTC is still the previous day', () => {
    // 20:00 UTC on 31 Dec 2026 is 03:00 on 1 Jan 2027 (พ.ศ. 2570) in Bangkok.
    expect(formatThaiDate(new Date('2026-12-31T20:00:00Z'))).toContain('2570')
  })
})
