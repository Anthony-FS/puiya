/**
 * Timestamps are stored in UTC and shown in Thai local time with the Buddhist era (พ.ศ.).
 */

export const THAI_TIME_ZONE = 'Asia/Bangkok'
const BUDDHIST_ERA_OFFSET = 543

export function toBuddhistYear(gregorianYear: number): number {
  return gregorianYear + BUDDHIST_ERA_OFFSET
}

const dateFormatter = new Intl.DateTimeFormat('th-TH-u-ca-buddhist', {
  timeZone: THAI_TIME_ZONE,
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

const dateTimeFormatter = new Intl.DateTimeFormat('th-TH-u-ca-buddhist', {
  timeZone: THAI_TIME_ZONE,
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

/** e.g. 2026-10-27T06:00:00Z → "27 ต.ค. 2569" */
export function formatThaiDate(date: Date): string {
  return dateFormatter.format(date)
}

/** e.g. 2026-10-27T06:00:00Z → "27 ต.ค. 2569 13:00" */
export function formatThaiDateTime(date: Date): string {
  return dateTimeFormatter.format(date)
}
