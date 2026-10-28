import { UserCreateDialog } from '@/components/admin/users/user-create-dialog'
import { UserDeleteDialog } from '@/components/admin/users/user-delete-dialog'
import { UserEditSheet } from '@/components/admin/users/user-edit-sheet'
import { createUserColumns } from '@/components/admin/users/user-columns'
import { DataTable } from '@/components/data-table/data-table'
import { PageHeader } from '@/components/dashboard/page-header'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { adminApi } from '@/lib/api'
import type { IdentityUser } from '@/lib/api'
import {
  forgetUser,
  rememberUser,
  rememberUsers,
} from '@/lib/admin-users-cache'
import { apiErrorMessage } from '@/lib/errors'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

export const Route = createFileRoute('/_authed/_admin/admin/users/')({
  head: () => ({
    meta: [{ title: 'Kelola Pengguna — xxxdonacion' }],
  }),
  component: AdminUsersPage,
})

type UsersPageState = {
  items: IdentityUser[]
  nextCursor?: string
  hasMore: boolean
}

const emptyPage: UsersPageState = {
  items: [],
  hasMore: false,
}

function AdminUsersPage() {
  const { user: me } = useAuth()
  const navigate = useNavigate()
  const [page, setPage] = useState<UsersPageState>(emptyPage)
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(20)
  const [cursors, setCursors] = useState<(string | undefined)[]>([undefined])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [editUser, setEditUser] = useState<IdentityUser | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<IdentityUser | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const requestId = useRef(0)

  /**
   * Fetch satu halaman. `cursor` disimpan per index supaya tombol Sebelumnya
   * bisa kembali ke cursor halaman sebelumnya tanpa mengubah backend.
   */
  const loadPage = useCallback(
    async (index: number, cursor: string | undefined) => {
      const request = ++requestId.current
      setLoading(true)
      setError(null)

      try {
        const result = await adminApi.listUsers({ limit: pageSize, cursor })
        if (request !== requestId.current) return

        rememberUsers(result.items)
        setPage({
          items: result.items,
          nextCursor: result.next_cursor,
          hasMore: result.has_more,
        })
        setPageIndex(index)
        setCursors((current) => {
          const next = current.slice(0, index + 1)
          next[index] = cursor
          return next
        })
      } catch (err) {
        if (request === requestId.current) setError(apiErrorMessage(err))
      } finally {
        if (request === requestId.current) setLoading(false)
      }
    },
    [pageSize],
  )

  useEffect(() => {
    void loadPage(0, undefined)
  }, [loadPage])

  function handleUserChanged(updated: IdentityUser, message: string) {
    rememberUser(updated)
    setPage((current) => ({
      ...current,
      items: current.items.map((item) =>
        item.id === updated.id ? updated : item,
      ),
    }))
    setEditUser((current) => (current?.id === updated.id ? updated : current))
    setError(null)
    setNotice(message)
  }

  function handleDelete(target: IdentityUser) {
    setDeleteError(null)
    setDeleteTarget(target)
  }

  async function confirmDelete() {
    if (!deleteTarget) return

    setDeletingId(deleteTarget.id)
    setDeleteError(null)
    setNotice(`Menghapus ${deleteTarget.email}…`)

    try {
      await adminApi.deleteUser(deleteTarget.id)
      forgetUser(deleteTarget.id)
      setNotice(`User ${deleteTarget.email} dihapus.`)
      setEditUser((current) =>
        current?.id === deleteTarget.id ? null : current,
      )
      setDeleteTarget(null)
      await loadPage(pageIndex, cursors[pageIndex])
    } catch (err) {
      setDeleteError(apiErrorMessage(err))
      setNotice(null)
    } finally {
      setDeletingId(null)
    }
  }

  function handleCreated(created: IdentityUser) {
    rememberUser(created)
    setCreateOpen(false)
    setNotice(`User ${created.email} berhasil dibuat.`)
    void loadPage(0, undefined)
  }

  const canPrevious = pageIndex > 0
  const canNext = page.hasMore && Boolean(page.nextCursor)

  function goPrevious() {
    if (!canPrevious) return
    void loadPage(pageIndex - 1, cursors[pageIndex - 1])
  }

  function goNext() {
    if (!page.nextCursor) return
    void loadPage(pageIndex + 1, page.nextCursor)
  }

  const columns = createUserColumns({
    me,
    onDetail: (user) =>
      void navigate({
        to: '/admin/users/$userId',
        params: { userId: user.id },
      }),
    onEdit: setEditUser,
    onDelete: handleDelete,
  })

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Kelola Pengguna"
        description="Daftar user dari database backend. Perubahan role dan status langsung berlaku."
      >
        <Button onClick={() => setCreateOpen(true)}>
          <Plus data-icon="inline-start" />
          Tambah user
        </Button>
      </PageHeader>

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {notice ? (
        <Alert>
          <AlertDescription>{notice}</AlertDescription>
        </Alert>
      ) : null}

      <DataTable
        columns={columns}
        data={page.items}
        loading={loading}
        emptyMessage="Belum ada user. Tambahkan user pertama lewat tombol di atas."
        getRowId={(user) => user.id}
        pagination={{
          pageIndex,
          pageSize,
          rowCount: page.items.length,
          canPrevious,
          canNext,
          loading: loading || deletingId !== null,
          onPrevious: goPrevious,
          onNext: goNext,
          onPageSizeChange: setPageSize,
        }}
      />

      {editUser ? (
        <UserEditSheet
          key={editUser.id}
          user={editUser}
          me={me}
          onClose={() => setEditUser(null)}
          onChanged={handleUserChanged}
        />
      ) : null}

      <UserCreateDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={handleCreated}
      />

      <UserDeleteDialog
        user={deleteTarget}
        open={deleteTarget !== null}
        loading={deletingId !== null}
        error={deleteError}
        onOpenChange={(open) => {
          if (!open && deletingId === null) {
            setDeleteTarget(null)
            setDeleteError(null)
          }
        }}
        onConfirm={() => void confirmDelete()}
      />
    </div>
  )
}
