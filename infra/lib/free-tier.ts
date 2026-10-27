/**
 * Always-free DynamoDB allowance (ADR 0003): 25 read and 25 write capacity units in total,
 * shared by every provisioned table and index in the account and region. Local secondary
 * indexes have no capacity of their own, but each write that touches one also uses the table's
 * write units, so the real write throughput is roughly half the numbers below.
 *
 * Staging and prod each get their own tables, so the per-stage budget is split between them.
 */
export const DYNAMODB_FREE_UNITS = 25

export const capacity = {
  staging: { main: { read: 5, write: 5 }, people: { read: 2, write: 2 } },
  prod: { main: { read: 12, write: 12 }, people: { read: 4, write: 4 } },
} as const

export type Stage = keyof typeof capacity
export const stages = Object.keys(capacity) as Stage[]

export function totalUnits(kind: 'read' | 'write'): number {
  return stages.reduce((sum, stage) => {
    const c = capacity[stage]
    return sum + c.main[kind] + c.people[kind]
  }, 0)
}
