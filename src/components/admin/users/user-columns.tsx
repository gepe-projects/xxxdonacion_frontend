import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { IdentityUser } from '@/lib/api'
import type { ColumnDef } from '@tanstack/react-table'
import { Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { RoleBadges, StatusBadge, canManageUser } from './user-shared'

type UserColumnOptions = {
  me: IdentityUser | null
  onDetail: (user: IdentityUser) => void
  onEdit: (user: IdentityUser) => void
  onDelete: (user: IdentityUser) => void
}

/**
 * Definisi kolom sengaja dipisah dari halaman supaya perubahan tabel cukup
 * dilakukan di file ini.
 */
export function createUserColumns({
  me,
  onDetail,
  onEdit,
  onDelete,
}: UserColumnOptions): ColumnDef<IdentityUser>[] {
  return [
    {
      accessorKey: 'name',
      header: 'Nama',
      cell: ({ row }) => {
        const user = row.original

        return (
          <div className="flex flex-col">
            <span className="font-medium">{user.name || '—'}</span>
            {me?.id === user.id ? (
              <span className="text-xs text-muted-foreground">Kamu</span>
            ) : null}
          </div>
        )
      },
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => (
        <span className="block max-w-56 truncate">{row.original.email}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: 'roles',
      header: 'Role',
      cell: ({ row }) => <RoleBadges roles={row.original.roles} />,
    },
    {
      id: 'actions',
      header: () => <span className="sr-only">Aksi</span>,
      cell: ({ row }) => {
        const user = row.original
        const canManage = canManageUser(me, user)

        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Aksi untuk ${user.email}`}
                  />
                }
              >
                <MoreHorizontal />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-40 rounded-xl">
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => onDetail(user)}>
                    <Eye />
                    Detail
                  </DropdownMenuItem>
                  {canManage ? (
                    <DropdownMenuItem onClick={() => onEdit(user)}>
                      <Pencil />
                      Edit
                    </DropdownMenuItem>
                  ) : null}
                </DropdownMenuGroup>
                {canManage ? (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => onDelete(user)}
                      >
                        <Trash2 />
                        Hapus
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </>
                ) : null}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]
}
