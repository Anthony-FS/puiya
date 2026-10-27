import { useTranslation } from 'react-i18next'
import { EmptyState, Screen } from '../../src/components/Screen'

export default function SellScreen() {
  const { t } = useTranslation()
  return (
    <Screen title={t('sell.title')}>
      <EmptyState message={t('sell.empty')} />
    </Screen>
  )
}
