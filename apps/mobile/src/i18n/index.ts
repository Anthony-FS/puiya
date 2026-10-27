import { getLocales } from 'expo-localization'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { pickLanguage, resources } from './resources'

i18n.use(initReactI18next).init({
  resources,
  lng: pickLanguage(getLocales()[0]?.languageCode),
  fallbackLng: 'th',
  // React already escapes text, so i18next must not escape it twice.
  interpolation: { escapeValue: false },
})

export default i18n
