import { describe, expect, it } from 'vitest'
import { productSchema, saleSchema, thaiMobileSchema } from './schemas'

const SHOP = '0b9f4a52-5c8e-4c3a-9d55-3f1a2b6c7d8e'
const PRODUCT = '6a1d2e3f-4b5c-4d7e-8f90-a1b2c3d4e5f6'
const SALE = '9e8d7c6b-5a49-4382-a716-f5e4d3c2b1a0'

describe('thaiMobileSchema', () => {
  it('normalises valid numbers to E.164', () => {
    expect(thaiMobileSchema.parse('081-234-5678')).toBe('+66812345678')
  })

  it('rejects landlines and junk', () => {
    expect(thaiMobileSchema.safeParse('021234567').success).toBe(false)
  })
})

describe('productSchema', () => {
  it('accepts a registered fertiliser', () => {
    const result = productSchema.safeParse({
      id: PRODUCT,
      barcode: '8851234567890',
      nameTh: 'ปุ๋ยสูตร 15-15-15',
      nameEn: null,
      category: 'fertiliser',
      doaRegistrationNo: 'example-reg-001',
      unit: 'กระสอบ',
      priceSatang: 95000,
    })
    expect(result.success).toBe(true)
  })

  it('rejects a fractional price', () => {
    const result = productSchema.safeParse({
      id: PRODUCT,
      barcode: null,
      nameTh: 'เมล็ดพันธุ์ข้าวโพด',
      nameEn: null,
      category: 'seed',
      doaRegistrationNo: null,
      unit: 'ถุง',
      priceSatang: 99.5,
    })
    expect(result.success).toBe(false)
  })
})

describe('saleSchema', () => {
  const validSale = {
    id: SALE,
    shopId: SHOP,
    createdAt: '2026-10-27T06:00:00Z',
    lines: [{ productId: PRODUCT, quantity: 2, unitPriceSatang: 95000, lineTotalSatang: 190000 }],
    totalSatang: 190000,
    paymentMethod: 'cash',
    creditCustomerId: null,
  }

  it('accepts a valid sale', () => {
    expect(saleSchema.safeParse(validSale).success).toBe(true)
  })

  it('rejects a sale with no lines', () => {
    expect(saleSchema.safeParse({ ...validSale, lines: [] }).success).toBe(false)
  })

  it('rejects an unknown payment method', () => {
    expect(saleSchema.safeParse({ ...validSale, paymentMethod: 'cheque' }).success).toBe(false)
  })
})
