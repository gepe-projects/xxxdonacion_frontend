import { PagePlaceholder } from '@/components/dashboard/page-placeholder'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/_app/pengaturan/profil')({
  head: () => ({
    meta: [{ title: 'Profil — xxxdonacion' }],
  }),
  component: ProfilPage,
})

function ProfilPage() {
  return (
    <PagePlaceholder
      title="Profil"
      description="Atur informasi profil publik dan akun kamu."
    />
  )
}
