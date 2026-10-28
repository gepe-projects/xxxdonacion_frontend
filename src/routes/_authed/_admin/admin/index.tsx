import { PageHeader } from '@/components/dashboard/page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useAuth } from '@/hooks/use-auth'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, ShieldCheck, Users } from 'lucide-react'

export const Route = createFileRoute('/_authed/_admin/admin/')({
  head: () => ({
    meta: [{ title: 'Dashboard Admin — xxxdonacion' }],
  }),
  component: AdminOverviewPage,
})

function AdminOverviewPage() {
  const { user, hasRole } = useAuth()
  const isSuperAdmin = hasRole('SUPER_ADMIN')

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Dashboard Admin"
        description="Ringkasan pengelolaan akses dan akun pengguna aplikasi."
      >
        {user?.roles.map((role) => (
          <Badge
            key={role}
            variant={role === 'SUPER_ADMIN' ? 'default' : 'secondary'}
          >
            {role === 'SUPER_ADMIN'
              ? 'Super Admin'
              : role === 'ADMIN'
                ? 'Admin'
                : 'User'}
          </Badge>
        ))}
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Users />
            </div>
            <CardTitle>Kelola pengguna</CardTitle>
            <CardDescription>
              Cari pengguna, ubah status aktif, atur role, atau hapus akun.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button render={<Link to="/admin/users" />} data-icon="inline-end">
              Buka kelola pengguna
              <ArrowRight data-icon="inline-end" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ShieldCheck />
            </div>
            <CardTitle>Kebijakan role</CardTitle>
            <CardDescription>
              {isSuperAdmin
                ? 'Sebagai SUPER_ADMIN kamu bisa mengelola USER dan ADMIN. SUPER_ADMIN tidak bisa diubah lewat aplikasi.'
                : 'Sebagai ADMIN kamu bisa mengelola USER. Mengelola ADMIN dan memberikan role ADMIN hanya bisa dilakukan SUPER_ADMIN.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Badge variant="secondary">User</Badge>
            <Badge variant="outline">Admin</Badge>
            <Badge>Super Admin</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
