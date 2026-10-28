import { PagePlaceholder } from '@/components/dashboard/page-placeholder'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/_app/marketplace')({
  head: () => ({
    meta: [{ title: 'Marketplace — xxxdonacion' }],
  }),
  component: MarketplacePage,
})

function MarketplacePage() {
  return (
    <PagePlaceholder
      title="Marketplace"
      description="Produk dan jasa kreator akan tampil di halaman ini."
    />
  )
}
