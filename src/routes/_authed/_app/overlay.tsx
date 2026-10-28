import { PagePlaceholder } from '@/components/dashboard/page-placeholder'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/_app/overlay')({
  head: () => ({
    meta: [{ title: 'Overlay — xxxdonacion' }],
  }),
  component: OverlayPage,
})

function OverlayPage() {
  return (
    <PagePlaceholder
      title="Overlay"
      description="Kelola overlay donasi untuk live stream kamu."
    />
  )
}
