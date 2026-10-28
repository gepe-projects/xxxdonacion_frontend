import { PagePlaceholder } from '@/components/dashboard/page-placeholder'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/_app/donasi/riwayat')({
  head: () => ({
    meta: [{ title: 'Riwayat Donasi — xxxdonacion' }],
  }),
  component: RiwayatDonasiPage,
})

function RiwayatDonasiPage() {
  return (
    <PagePlaceholder
      title="Riwayat Donasi"
      description="Riwayat transaksi donasi kamu akan tampil di halaman ini."
    />
  )
}
