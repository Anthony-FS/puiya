import { colors, fontFamily, space, type } from '@puiya/ui'
import type { ReactNode } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { SyncBadge } from '../features/sync/SyncBadge'

type Props = {
  title: string
  children: ReactNode
}

/** Every tab screen: title, the always-visible sync status, then the screen's content. */
export function Screen({ title, children }: Props) {
  // Static until real sync lands in P2-04.
  const sync = { online: true, pendingCount: 0 }

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safe}>
      <View style={styles.header}>
        <Text accessibilityRole="header" style={styles.title}>
          {title}
        </Text>
        <SyncBadge {...sync} />
      </View>
      <View style={styles.body}>{children}</View>
    </SafeAreaView>
  )
}

export function EmptyState({ message }: { message: string }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyText}>{message}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    gap: space.sm,
    paddingHorizontal: space.lg,
    paddingTop: space.lg,
    paddingBottom: space.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  title: { ...type.title, fontFamily: fontFamily.bold, color: colors.ink },
  body: { flex: 1, padding: space.lg },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: space.xl },
  emptyText: {
    ...type.bodyLarge,
    fontFamily: fontFamily.regular,
    color: colors.muted,
    textAlign: 'center',
  },
})
