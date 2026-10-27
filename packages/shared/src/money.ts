/**
 * Money is always handled as integer satang (1 baht = 100 satang).
 * Floats are never used for money: 0.1 + 0.2 !== 0.3.
 */

declare const satangBrand: unique symbol
export type Satang = number & { readonly [satangBrand]: true }

export function satang(value: number): Satang {
  if (!Number.isSafeInteger(value)) {
    throw new RangeError(`Satang must be a safe integer, got ${value}`)
  }
  return value as Satang
}

/**
 * Parses a baht amount typed by a person ("1,250", "1250.5", "฿99.00") into satang.
 * Rejects more than two decimal places instead of silently rounding.
 */
export function parseBaht(input: string): Satang {
  const cleaned = input.trim().replace(/^฿/, '').replace(/,/g, '').trim()
  const match = /^(-)?(\d+)(?:\.(\d{1,2}))?$/.exec(cleaned)
  if (!match) {
    throw new RangeError(`Not a valid baht amount: "${input}"`)
  }
  const [, sign, whole = '0', fraction = ''] = match
  const total = Number(whole) * 100 + Number(fraction.padEnd(2, '0'))
  return satang(sign ? -total : total)
}

const bahtFormatter = new Intl.NumberFormat('th-TH', {
  style: 'currency',
  currency: 'THB',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/** Formats satang for display, e.g. 125050 → "฿1,250.50". */
export function formatBaht(amount: Satang): string {
  return bahtFormatter.format(amount / 100)
}

export function addSatang(...amounts: Satang[]): Satang {
  return satang(amounts.reduce<number>((sum, a) => sum + a, 0))
}

/** Line total for a quantity of an item; quantity may be fractional (e.g. 2.5 kg). */
export function lineTotal(unitPrice: Satang, quantity: number): Satang {
  if (!Number.isFinite(quantity) || quantity <= 0) {
    throw new RangeError(`Quantity must be positive, got ${quantity}`)
  }
  if (unitPrice < 0) {
    throw new RangeError(`Unit price cannot be negative, got ${unitPrice}`)
  }
  // Round to the nearest satang; exact halves round up.
  return satang(Math.round(unitPrice * quantity))
}
