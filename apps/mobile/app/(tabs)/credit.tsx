import { useTranslation } from 'react-i18next'
import { EmptyState, Screen } from '../../src/components/Screen'

export default function CreditScreen() {
  const { t } = useTranslation()
  return (
    <Screen title={t('credit.title')}>
      <EmptyState message={t('credit.empty')} />
    </Screen>
  )
}
