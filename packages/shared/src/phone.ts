/**
 * Thai mobile numbers: 10 digits starting 06, 08 or 09 locally, or +66 without the leading 0.
 * Stored in E.164 form (+66812345678); displayed as 081-234-5678.
 */

const LOCAL_MOBILE = /^0[689]\d{8}$/

export function normaliseThaiMobile(input: string): string | null {
  const digits = input.replace(/[\s\-().]/g, '')
  let local: string
  if (digits.startsWith('+66')) {
    local = `0${digits.slice(3)}`
  } else if (digits.startsWith('66') && digits.length === 11) {
    local = `0${digits.slice(2)}`
  } else {
    local = digits
  }
  return LOCAL_MOBILE.test(local) ? `+66${local.slice(1)}` : null
}

export function formatThaiMobile(e164: string): string {
  const local = `0${e164.replace(/^\+66/, '')}`
  return `${local.slice(0, 3)}-${local.slice(3, 6)}-${local.slice(6)}`
}
