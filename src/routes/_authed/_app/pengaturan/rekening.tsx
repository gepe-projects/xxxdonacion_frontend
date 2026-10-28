import { PagePlaceholder } from '@/components/dashboard/page-placeholder'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/_app/pengaturan/rekening')({
  head: () => ({
    meta: [{ title: 'Rekening — xxxdonacion' }],
  }),
  component: RekeningPage,
})

function RekeningPage() {
  return (
    <PagePlaceholder
      title="Rekening"
      description="Kelola rekening dan metode pencairan dana donasi."
    />
  )
}
