import { z } from 'zod'
import { normaliseThaiMobile } from './phone'

/**
 * Shared schemas: the phone, the API and sync all validate with these, so they cannot drift.
 * Money fields are integer satang.
 */

export const satangSchema = z.number().int().safe()

export const thaiMobileSchema = z.string().transform((value, ctx) => {
  const normalised = normaliseThaiMobile(value)
  if (!normalised) {
    ctx.addIssue({ code: 'custom', message: 'Not a valid Thai mobile number' })
    return z.NEVER
  }
  return normalised
})

export const productCategorySchema = z.enum(['fertiliser', 'pesticide', 'seed', 'other'])

export const productSchema = z.object({
  id: z.uuid(),
  barcode: z.string().min(1).nullable(),
  nameTh: z.string().min(1),
  nameEn: z.string().min(1).nullable(),
  category: productCategorySchema,
  /**
   * Department of Agriculture registration number as printed on the label.
   * Required for fertiliser, pesticide and seed; the legality check at the till depends on it.
   * Format is validated against the DOA catalogue, not here.
   */
  doaRegistrationNo: z.string().min(1).nullable(),
  unit: z.string().min(1),
  priceSatang: satangSchema.nonnegative(),
})

export const saleLineSchema = z.object({
  productId: z.uuid(),
  quantity: z.number().positive(),
  unitPriceSatang: satangSchema.nonnegative(),
  lineTotalSatang: satangSchema.nonnegative(),
})

export const paymentMethodSchema = z.enum(['cash', 'promptpay', 'credit'])

export const saleSchema = z.object({
  /** Generated on the device so offline sales sync without duplicates. */
  id: z.uuid(),
  shopId: z.uuid(),
  createdAt: z.iso.datetime(),
  lines: z.array(saleLineSchema).min(1),
  totalSatang: satangSchema.nonnegative(),
  paymentMethod: paymentMethodSchema,
  /** Only for credit sales; links to the farmer in the credit ledger. */
  creditCustomerId: z.uuid().nullable(),
})

export type Product = z.infer<typeof productSchema>
export type SaleLine = z.infer<typeof saleLineSchema>
export type Sale = z.infer<typeof saleSchema>
export type PaymentMethod = z.infer<typeof paymentMethodSchema>
