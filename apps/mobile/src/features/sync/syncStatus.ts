export type SyncStatus = 'synced' | 'pending' | 'offline'

export type SyncState = {
  /** Whether the phone can reach the server right now. */
  online: boolean
  /** Records saved on the phone that the server has not confirmed yet. */
  pendingCount: number
}

/**
 * Offline wins over pending: the shop owner needs to know the phone is offline, and that
 * their sales are still safe on the phone.
 */
export function deriveSyncStatus({ online, pendingCount }: SyncState): SyncStatus {
  if (!Number.isInteger(pendingCount) || pendingCount < 0) {
    throw new RangeError(`pendingCount must be a whole number ≥ 0, got ${pendingCount}`)
  }
  if (!online) return 'offline'
  return pendingCount > 0 ? 'pending' : 'synced'
}
