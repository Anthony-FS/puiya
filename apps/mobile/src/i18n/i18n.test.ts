import { describe, expect, it } from 'vitest'
import { en } from './en'
import { pickLanguage } from './resources'
import { th } from './th'

type Tree = { readonly [key: string]: string | Tree }

function flatten(tree: Tree, prefix = ''): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [key, value] of Object.entries(tree)) {
    const path = prefix ? `${prefix}.${key}` : key
    if (typeof value === 'string') out[path] = value
    else Object.assign(out, flatten(value, path))
  }
  return out
}

const placeholders = (text: string) =>
  [...text.matchAll(/{{\s*(\w+)\s*}}/g)].map((m) => m[1]).sort()

const thai = flatten(th)
const english = flatten(en)

describe('translations', () => {
  it('has the same keys in Thai and English', () => {
    expect(Object.keys(english).sort()).toEqual(Object.keys(thai).sort())
  })

  it.each(Object.keys(thai))('%s is filled in both languages', (key) => {
    expect(thai[key]?.trim()).not.toBe('')
    expect(english[key]?.trim()).not.toBe('')
  })

  it.each(Object.keys(thai))('%s uses the same placeholders in both languages', (key) => {
    expect(placeholders(english[key] ?? '')).toEqual(placeholders(thai[key] ?? ''))
  })

  it('writes the Thai copy in Thai script', () => {
    for (const [key, text] of Object.entries(thai)) {
      expect(/[฀-๿]/.test(text), key).toBe(true)
    }
  })
})

describe('pickLanguage', () => {
  it('uses English only when the phone is set to English', () => {
    expect(pickLanguage('en')).toBe('en')
  })

  it.each(['th', 'zh', null, undefined])('falls back to Thai for %s', (code) => {
    expect(pickLanguage(code)).toBe('th')
  })
})
