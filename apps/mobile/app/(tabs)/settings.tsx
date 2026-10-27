import { colors, fontFamily, space, touch, type } from '@puiya/ui'
import Constants from 'expo-constants'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, View } from 'react-native'
import { Screen } from '../../src/components/Screen'

export default function SettingsScreen() {
  const { t, i18n } = useTranslation()
  const version = Constants.expoConfig?.version ?? '0.0.0'

  return (
    <Screen title={t('settings.title')}>
      <View style={styles.row}>
        <Text style={styles.label}>{t('settings.language')}</Text>
        <Text style={styles.value}>{i18n.language === 'en' ? 'English' : 'ไทย'}</Text>
      </View>
      <Text style={styles.version}>{t('settings.version', { version })}</Text>
    </Screen>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: touch.primaryButtonHeight,
    paddingVertical: space.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  label: { ...type.body, fontFamily: fontFamily.medium, color: colors.ink },
  value: { ...type.body, fontFamily: fontFamily.regular, color: colors.muted },
  version: {
    ...type.caption,
    fontFamily: fontFamily.regular,
    color: colors.muted,
    marginTop: space.xl,
  },
})
