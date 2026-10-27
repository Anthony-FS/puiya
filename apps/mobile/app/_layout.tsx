import '../src/i18n'
import { Sarabun_400Regular } from '@expo-google-fonts/sarabun/400Regular'
import { Sarabun_500Medium } from '@expo-google-fonts/sarabun/500Medium'
import { Sarabun_700Bold } from '@expo-google-fonts/sarabun/700Bold'
import { colors } from '@puiya/ui'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'

export default function RootLayout() {
  // Import only the three weights we use: the package root would bundle all 16 (~1.5 MB).
  const [fontsLoaded] = useFonts({ Sarabun_400Regular, Sarabun_500Medium, Sarabun_700Bold })

  // Thai text drawn in the system font first and then swapped looks broken; wait for Sarabun.
  if (!fontsLoaded) return null

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}
      />
    </SafeAreaProvider>
  )
}
