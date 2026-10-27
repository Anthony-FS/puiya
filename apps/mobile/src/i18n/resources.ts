import { en } from './en'
import { th } from './th'

export const resources = {
  th: { translation: th },
  en: { translation: en },
} as const

export type Language = keyof typeof resources

/** Thai unless the phone is explicitly set to English. */
export function pickLanguage(languageCode: string | null | undefined): Language {
  return languageCode === 'en' ? 'en' : 'th'
}
