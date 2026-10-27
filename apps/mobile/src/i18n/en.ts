import type { Messages } from './th'

export const en: Messages = {
  tabs: {
    sell: 'Sell',
    stock: 'Stock',
    credit: 'Credit',
    settings: 'Settings',
  },
  sell: {
    title: 'Sell',
    empty: 'Scan a barcode or search for a product to start a sale',
  },
  stock: {
    title: 'Stock',
    empty: 'No products yet. Add products to see how many are left',
  },
  credit: {
    title: 'Credit',
    empty: 'No customers owe money right now',
  },
  settings: {
    title: 'Settings',
    language: 'Language',
    version: 'Version {{version}}',
  },
  sync: {
    synced: 'All saved',
    pending: 'Waiting to send {{count}} items',
    offline: 'Offline · saved on this phone',
  },
  common: {
    comingSoon: 'Coming soon',
  },
}
