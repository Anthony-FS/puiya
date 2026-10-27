import { useTranslation } from 'react-i18next'
import { EmptyState, Screen } from '../../src/components/Screen'

export default function StockScreen() {
  const { t } = useTranslation()
  return (
    <Screen title={t('stock.title')}>
      <EmptyState message={t('stock.empty')} />
    </Screen>
  )
}
