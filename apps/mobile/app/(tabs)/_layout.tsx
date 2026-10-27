import { colors, fontFamily, touch, type } from '@puiya/ui'
import { Tabs } from 'expo-router/js-tabs'
import { useTranslation } from 'react-i18next'

export default function TabsLayout() {
  const { t } = useTranslation()

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        // Icons need an icon package; labels alone stay large and clear until then.
        tabBarIcon: () => null,
        tabBarIconStyle: { display: 'none' },
        tabBarLabelStyle: { ...type.body, fontFamily: fontFamily.medium },
        tabBarStyle: {
          height: touch.tabBarHeight,
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: t('tabs.sell') }} />
      <Tabs.Screen name="stock" options={{ title: t('tabs.stock') }} />
      <Tabs.Screen name="credit" options={{ title: t('tabs.credit') }} />
      <Tabs.Screen name="settings" options={{ title: t('tabs.settings') }} />
    </Tabs>
  )
}
