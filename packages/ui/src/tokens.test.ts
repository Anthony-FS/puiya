import { describe, expect, it } from 'vitest'
import { contrastRatio } from './contrast'
import { colors, touch, type } from './tokens'

const AA = 4.5

describe('colour contrast (WCAG AA for text)', () => {
  it.each([
    ['ink on background', colors.ink, colors.background],
    ['ink on surface', colors.ink, colors.surface],
    ['muted on background', colors.muted, colors.background],
    ['muted on surface', colors.muted, colors.surface],
    ['onPrimary on primary', colors.onPrimary, colors.primary],
    ['primary on primarySoft', colors.primary, colors.primarySoft],
    ['warning on warningSoft', colors.warning, colors.warningSoft],
    ['danger on dangerSoft', colors.danger, colors.dangerSoft],
    ['offline on offlineSoft', colors.offline, colors.offlineSoft],
  ])('%s meets 4.5:1', (_name, fg, bg) => {
    expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(AA)
  })
})

describe('contrastRatio', () => {
  it('is 21 for black on white', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 5)
  })

  it('rejects malformed colours', () => {
    expect(() => contrastRatio('red', '#FFFFFF')).toThrow(RangeError)
  })
})

describe('sizes for older users', () => {
  it('keeps body text at 18px or more', () => {
    expect(type.body.fontSize).toBeGreaterThanOrEqual(18)
  })

  it('keeps tap targets at 48dp or more', () => {
    expect(touch.minTarget).toBeGreaterThanOrEqual(48)
    expect(touch.primaryButtonHeight).toBeGreaterThanOrEqual(touch.minTarget)
  })

  it('gives Thai text at least 1.5x line height', () => {
    for (const style of Object.values(type)) {
      expect(style.lineHeight / style.fontSize).toBeGreaterThanOrEqual(1.5)
    }
  })
})
