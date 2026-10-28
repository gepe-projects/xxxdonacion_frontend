import { PageHeader } from '@/components/dashboard/page-header'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useAuth } from '@/hooks/use-auth'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/_app/dashboard')({
  head: () => ({
    meta: [{ title: 'Dashboard — xxxdonacion' }],
  }),
  component: DashboardPage,
})

const roleLabel = {
  USER: 'User',
  ADMIN: 'Admin',
  SUPER_ADMIN: 'Super Admin',
} as const

function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Dashboard"
        description="Ringkasan aktivitas donasi, overlay, dan marketplace kamu."
      >
        {user?.roles.map((role) => (
          <Badge
            key={role}
            variant={role === 'SUPER_ADMIN' ? 'default' : 'secondary'}
          >
            {roleLabel[role]}
          </Badge>
        ))}
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Total donasi</CardDescription>
            <CardTitle className="text-2xl">—</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Belum ada data donasi.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Overlay aktif</CardDescription>
            <CardTitle className="text-2xl">—</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Belum ada overlay yang aktif.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Produk marketplace</CardDescription>
            <CardTitle className="text-2xl">—</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Belum ada produk yang dijual.
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
