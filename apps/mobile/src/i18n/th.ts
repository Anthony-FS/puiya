/**
 * Thai copy: the source of truth for every string in the app.
 * New or changed strings must be listed in the PR for the owner to approve.
 */
export const th = {
  tabs: {
    sell: 'ขาย',
    stock: 'สต็อก',
    credit: 'ลูกหนี้',
    settings: 'ตั้งค่า',
  },
  sell: {
    title: 'ขายสินค้า',
    empty: 'สแกนบาร์โค้ดหรือค้นหาสินค้าเพื่อเริ่มขาย',
  },
  stock: {
    title: 'สต็อกสินค้า',
    empty: 'ยังไม่มีสินค้าในร้าน เพิ่มสินค้าเพื่อดูจำนวนคงเหลือ',
  },
  credit: {
    title: 'ลูกหนี้',
    empty: 'ยังไม่มีลูกค้าที่ค้างจ่าย',
  },
  settings: {
    title: 'ตั้งค่า',
    language: 'ภาษา',
    version: 'เวอร์ชัน {{version}}',
  },
  sync: {
    synced: 'บันทึกครบแล้ว',
    pending: 'รอส่งข้อมูล {{count}} รายการ',
    offline: 'ออฟไลน์ · บันทึกไว้ในเครื่องแล้ว',
  },
  common: {
    comingSoon: 'เร็วๆ นี้',
  },
} as const

/** Same keys as Thai, with string values: TypeScript rejects a missing or extra key. */
type DeepStrings<T> = { [K in keyof T]: T[K] extends string ? string : DeepStrings<T[K]> }
export type Messages = DeepStrings<typeof th>
