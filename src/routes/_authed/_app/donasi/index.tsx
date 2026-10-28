import { PagePlaceholder } from '@/components/dashboard/page-placeholder'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/_app/donasi/')({
  head: () => ({
    meta: [{ title: 'Donasi — xxxdonacion' }],
  }),
  component: DonasiPage,
})

function DonasiPage() {
  return (
    <PagePlaceholder
      title="Semua Donasi"
      description="Daftar donasi yang masuk akan tampil di halaman ini."
    />
  )
}
