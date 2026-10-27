import { colors, fontFamily, radius, space, touch, type } from '@puiya/ui'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, View } from 'react-native'
import { deriveSyncStatus, type SyncState, type SyncStatus } from './syncStatus'

// Each state has a symbol as well as a colour, so it reads without colour vision.
const look: Record<SyncStatus, { symbol: string; fg: string; bg: string }> = {
  synced: { symbol: '✓', fg: colors.success, bg: colors.primarySoft },
  pending: { symbol: '↑', fg: colors.warning, bg: colors.warningSoft },
  offline: { symbol: '○', fg: colors.offline, bg: colors.offlineSoft },
}

export function SyncBadge(state: SyncState) {
  const { t } = useTranslation()
  const status = deriveSyncStatus(state)
  const { symbol, fg, bg } = look[status]
  const label = t(`sync.${status}`, { count: state.pendingCount })

  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={label}
      style={[styles.badge, { backgroundColor: bg }]}
    >
      <Text style={[styles.symbol, { color: fg }]}>{symbol}</Text>
      <Text style={[styles.label, { color: fg }]}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: space.sm,
    minHeight: touch.minTarget - space.md,
    paddingHorizontal: space.md,
    paddingVertical: space.xs,
    borderRadius: radius.pill,
  },
  symbol: { ...type.body, fontFamily: fontFamily.bold },
  label: { ...type.caption, fontFamily: fontFamily.medium },
})
