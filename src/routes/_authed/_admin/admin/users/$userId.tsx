import { UserEditSheet } from '@/components/admin/users/user-edit-sheet'
import {
  RoleBadges,
  StatusBadge,
  canManageUser,
  userLockReason,
} from '@/components/admin/users/user-shared'
import { PageHeader } from '@/components/dashboard/page-header'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import { useAuth } from '@/hooks/use-auth'
import type { IdentityUser } from '@/lib/api'
import {
  findUserById,
  getCachedUser,
  rememberUser,
} from '@/lib/admin-users-cache'
import { apiErrorMessage } from '@/lib/errors'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowLeft, Pencil } from 'lucide-react'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/_authed/_admin/admin/users/$userId')({
  head: () => ({
    meta: [{ title: 'Detail Pengguna — xxxdonacion' }],
  }),
  component: AdminUserDetailPage,
})

function AdminUserDetailPage() {
  const { userId } = Route.useParams()
  const { user: me } = useAuth()
  const [user, setUser] = useState<IdentityUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [editOpen, setEditOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    const cached = getCachedUser(userId)

    if (cached) {
      setUser(cached)
      setLoading(false)
      setError(null)
      return () => {
        cancelled = true
      }
    }

    setUser(null)
    setLoading(true)
    setError(null)

    void findUserById(userId)
      .then((found) => {
        if (cancelled) return
        if (!found) {
          setError('User tidak ditemukan.')
          return
        }
        setUser(found)
      })
      .catch((err) => {
        if (!cancelled) setError(apiErrorMessage(err))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [userId])

  function handleChanged(updated: IdentityUser, message: string) {
    rememberUser(updated)
    setUser(updated)
    setNotice(message)
  }

  const canManage = user ? canManageUser(me, user) : false
  const lockReason = user ? userLockReason(me, user) : null

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={user?.name || 'Detail Pengguna'}
        description="Informasi akun dan akses pengguna."
      >
        <Button variant="outline" render={<Link to="/admin/users" />}>
          <ArrowLeft data-icon="inline-start" />
          Kembali
        </Button>
        {canManage ? (
          <Button onClick={() => setEditOpen(true)}>
            <Pencil data-icon="inline-start" />
            Edit
          </Button>
        ) : null}
      </PageHeader>

      {notice ? (
        <Alert>
          <AlertDescription>{notice}</AlertDescription>
        </Alert>
      ) : null}

      {loading ? (
        <Card>
          <CardContent className="flex items-center gap-2 py-10 text-sm text-muted-foreground">
            <Spinner />
            Memuat detail user…
          </CardContent>
        </Card>
      ) : error || !user ? (
        <Card>
          <CardHeader>
            <CardTitle>User tidak ditemukan</CardTitle>
            <CardDescription>
              {error ?? 'Data user tidak tersedia.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" render={<Link to="/admin/users" />}>
              Kembali ke daftar user
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={user.status} />
              <RoleBadges roles={user.roles} />
              {me?.id === user.id ? <Badge variant="ghost">Kamu</Badge> : null}
            </div>
            <CardTitle>{user.name || user.email}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-5">
            <Separator />
            <dl className="grid grid-cols-[7rem_1fr] gap-x-4 gap-y-3 text-sm">
              <dt className="text-muted-foreground">Nama</dt>
              <dd>{user.name || '—'}</dd>

              <dt className="text-muted-foreground">Email</dt>
              <dd className="break-all">{user.email}</dd>

              <dt className="text-muted-foreground">Status</dt>
              <dd>
                <StatusBadge status={user.status} />
              </dd>

              <dt className="text-muted-foreground">Role</dt>
              <dd>
                <RoleBadges roles={user.roles} />
              </dd>

              <dt className="text-muted-foreground">ID user</dt>
              <dd className="font-mono text-xs break-all">{user.id}</dd>
            </dl>

            {lockReason ? (
              <Alert>
                <AlertDescription>{lockReason}</AlertDescription>
              </Alert>
            ) : null}
          </CardContent>
        </Card>
      )}

      {editOpen && user ? (
        <UserEditSheet
          key={user.id}
          user={user}
          me={me}
          onClose={() => setEditOpen(false)}
          onChanged={handleChanged}
        />
      ) : null}
    </div>
  )
}
