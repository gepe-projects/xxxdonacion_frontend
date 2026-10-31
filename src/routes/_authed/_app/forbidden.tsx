import { PageHeader } from '@/components/dashboard/page-header'
import { buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ShieldOff } from 'lucide-react'

export const Route = createFileRoute('/_authed/_app/forbidden')({
  head: () => ({
    meta: [{ title: 'Akses ditolak — xxxdonacion' }],
  }),
  component: ForbiddenPage,
})

function ForbiddenPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Akses ditolak"
        description="Role akun kamu tidak punya izin untuk membuka halaman ini."
      />
      <Card>
        <CardHeader>
          <div className="flex size-10 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <ShieldOff />
          </div>
          <CardTitle>403 — Forbidden</CardTitle>
          <CardDescription>
            Halaman admin hanya bisa diakses role ADMIN atau SUPER_ADMIN. Kalau
            kamu merasa seharusnya punya akses, minta admin memperbarui role
            akun kamu.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link to="/dashboard" className={buttonVariants()}>
            Kembali ke dashboard
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
