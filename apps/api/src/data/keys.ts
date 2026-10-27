/**
 * DynamoDB key layout (ADR 0003).
 *
 * Main table: everything a shop owns lives in one partition, `SHOP#<shopId>`, so a shop's data
 * is read with one query and access rules can check a single value.
 *
 *   pk              sk                      record
 *   SHOP#<shop>     META                    shop profile
 *   SHOP#<shop>     PRODUCT#<product>       product and price
 *   SHOP#<shop>     SALE#<sale>             sale (append-only)
 *   SHOP#<shop>     STOCK#<movement>        stock movement (append-only)
 *   SHOP#<shop>     CREDIT#<entry>          credit entry (append-only)
 *
 * People table (personal data, PDPA): same partition per shop, `CUSTOMER#<customer>` only.
 * `assertKindForTable` keeps personal data out of the main table and shop data out of this one.
 *
 * Both tables have a local secondary index on `syncKey` = `<updatedAt>#<sk>`, so "everything in
 * this shop changed after time T" is one query in time order. The index has no capacity of its
 * own, but every write that touches it also uses the table's write units (roughly doubling the
 * cost of a write), and it caps each shop's partition at 10 GB. It cannot be removed without
 * recreating the table.
 *
 * `updatedAt` must be set by the server when it accepts a write, never by the phone: a phone
 * with a wrong clock could otherwise write behind another device's sync cursor, and that change
 * would never be pulled.
 */

export const recordKinds = ['META', 'PRODUCT', 'SALE', 'STOCK', 'CREDIT', 'CUSTOMER'] as const
export type RecordKind = (typeof recordKinds)[number]

export type TableName = 'main' | 'people'

const kindsByTable: Record<TableName, readonly RecordKind[]> = {
  main: ['META', 'PRODUCT', 'SALE', 'STOCK', 'CREDIT'],
  people: ['CUSTOMER'],
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function assertUuid(value: string, label: string): void {
  if (!UUID.test(value)) {
    throw new RangeError(`${label} must be a UUID, got "${value}"`)
  }
}

export function shopPk(shopId: string): string {
  assertUuid(shopId, 'shopId')
  return `SHOP#${shopId.toLowerCase()}`
}

export function recordSk(kind: RecordKind, id?: string): string {
  if (kind === 'META') {
    if (id !== undefined) throw new RangeError('META records have no id')
    return 'META'
  }
  if (id === undefined) throw new RangeError(`${kind} records need an id`)
  assertUuid(id, `${kind} id`)
  return `${kind}#${id.toLowerCase()}`
}

export function parseSk(sk: string): { kind: RecordKind; id: string | null } {
  if (sk === 'META') return { kind: 'META', id: null }
  const [kind, id, ...rest] = sk.split('#')
  if (!kind || !id || rest.length > 0 || !recordKinds.includes(kind as RecordKind)) {
    throw new RangeError(`Unrecognised sort key "${sk}"`)
  }
  if (kind === 'META') throw new RangeError('META records have no id')
  assertUuid(id, 'id')
  return { kind: kind as RecordKind, id: id.toLowerCase() }
}

/** Throws unless a record of this kind belongs in this table (PDPA separation). */
export function assertKindForTable(table: TableName, kind: RecordKind): void {
  if (!kindsByTable[table].includes(kind)) {
    throw new RangeError(`${kind} records must not be stored in the ${table} table`)
  }
}

const ISO_UTC = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/

/**
 * Sort key for the sync index. The timestamp must be fixed-width UTC with milliseconds so that
 * string order equals time order; `sk` breaks ties between records changed in the same ms.
 */
export function syncKey(updatedAt: string, sk: string): string {
  // The round trip rejects impossible dates such as 2026-13-45T25:61:00.000Z.
  if (!ISO_UTC.test(updatedAt) || new Date(updatedAt).toISOString() !== updatedAt) {
    throw new RangeError(`updatedAt must look like 2026-10-27T06:00:00.000Z, got "${updatedAt}"`)
  }
  const { kind, id } = parseSk(sk)
  const canonical = id === null ? recordSk(kind) : recordSk(kind, id)
  return `${updatedAt}#${canonical}`
}

export const tableNames = {
  main: (stage: string) => `puiya-${stage}-main`,
  people: (stage: string) => `puiya-${stage}-people`,
} as const

export const syncIndexName = 'bySyncKey'
