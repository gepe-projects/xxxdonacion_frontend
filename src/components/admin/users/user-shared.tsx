import { Badge } from '@/components/ui/badge'
import type { IdentityUser, Role, UserStatus } from '@/lib/api'

export const roleLabel: Record<Role, string> = {
  USER: 'User',
  ADMIN: 'Admin',
  SUPER_ADMIN: 'Super Admin',
}

export const assignableRoles: Role[] = ['USER', 'ADMIN']

export function canManageUser(
  me: IdentityUser | null,
  target: IdentityUser,
): boolean {
  if (!me || me.id === target.id) return false
  if (target.roles.includes('SUPER_ADMIN')) return false
  if (me.roles.includes('SUPER_ADMIN')) return true
  return !target.roles.includes('ADMIN')
}

export function userLockReason(me: IdentityUser | null, target: IdentityUser) {
  if (!me) return 'Kamu tidak punya akses.'
  if (me.id === target.id) return null
  if (target.roles.includes('SUPER_ADMIN')) {
    return 'SUPER_ADMIN tidak bisa diubah lewat aplikasi.'
  }
  if (!me.roles.includes('SUPER_ADMIN') && target.roles.includes('ADMIN')) {
    return 'Hanya SUPER_ADMIN yang bisa mengelola ADMIN.'
  }
  return null
}

export function StatusBadge({ status }: { status: UserStatus }) {
  return (
    <Badge variant={status === 'ACTIVE' ? 'secondary' : 'destructive'}>
      {status === 'ACTIVE' ? 'Aktif' : 'Nonaktif'}
    </Badge>
  )
}

export function RoleBadges({ roles }: { roles: Role[] }) {
  return (
    <div className="flex flex-wrap gap-1">
      {roles.map((role) => (
        <Badge
          key={role}
          variant={role === 'SUPER_ADMIN' ? 'default' : 'outline'}
        >
          {roleLabel[role]}
        </Badge>
      ))}
    </div>
  )
}
