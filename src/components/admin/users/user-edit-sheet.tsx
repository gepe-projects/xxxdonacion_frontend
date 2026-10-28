import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldLabel } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Spinner } from '@/components/ui/spinner'
import { adminApi } from '@/lib/api'
import type { IdentityUser, Role, UserStatus } from '@/lib/api'
import { apiErrorMessage } from '@/lib/errors'
import { useState } from 'react'
import {
  RoleBadges,
  StatusBadge,
  assignableRoles,
  canManageUser,
  roleLabel,
  userLockReason,
} from './user-shared'

type UserEditSheetProps = {
  user: IdentityUser
  me: IdentityUser | null
  onClose: () => void
  onChanged: (user: IdentityUser, message: string) => void
}

export function UserEditSheet({
  user,
  me,
  onClose,
  onChanged,
}: UserEditSheetProps) {
  const canManage = canManageUser(me, user)
  const canGrantAdmin = me?.roles.includes('SUPER_ADMIN') ?? false
  const options = canGrantAdmin ? assignableRoles : (['USER'] as Role[])

  const [status, setStatus] = useState<UserStatus>(user.status)
  const [roles, setRoles] = useState<Role[]>(
    user.roles.filter((role) => assignableRoles.includes(role)),
  )
  const [saving, setSaving] = useState<'status' | 'roles' | null>(null)
  const [error, setError] = useState<string | null>(null)

  const statusChanged = status !== user.status
  const rolesChanged =
    roles.length !== user.roles.length ||
    roles.some((role) => !user.roles.includes(role))

  function toggleRole(role: Role) {
    setRoles((current) =>
      current.includes(role)
        ? current.filter((item) => item !== role)
        : [...current, role],
    )
  }

  async function saveStatus() {
    setSaving('status')
    setError(null)

    try {
      const updated = await adminApi.setUserStatus(user.id, status)
      onChanged(
        updated,
        `Status ${updated.email} diubah menjadi ${updated.status === 'ACTIVE' ? 'aktif' : 'nonaktif'}.`,
      )
    } catch (err) {
      setError(apiErrorMessage(err))
    } finally {
      setSaving(null)
    }
  }

  async function saveRoles() {
    setSaving('roles')
    setError(null)

    try {
      const updated = await adminApi.setUserRoles(user.id, roles)
      onChanged(updated, `Role ${updated.email} berhasil diperbarui.`)
    } catch (err) {
      setError(apiErrorMessage(err))
    } finally {
      setSaving(null)
    }
  }

  return (
    <Sheet open onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Edit {user.email}</SheetTitle>
          <SheetDescription>
            Hanya status dan role yang bisa diubah. Nama dan email dikelola oleh
            sistem.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-6 pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={user.status} />
            <RoleBadges roles={user.roles} />
          </div>

          {error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          {!canManage ? (
            <Alert>
              <AlertDescription>
                {userLockReason(me, user) ?? 'Akun ini tidak bisa diedit.'}
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <section className="flex flex-col gap-3">
                <div>
                  <h3 className="text-sm font-medium">Status akun</h3>
                  <p className="text-sm text-muted-foreground">
                    Nonaktifkan akun untuk mencabut akses user.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Select
                    value={status}
                    onValueChange={(value) => {
                      if (value) setStatus(value)
                    }}
                    disabled={saving !== null}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="ACTIVE">Aktif</SelectItem>
                        <SelectItem value="DISABLED">Nonaktif</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Button
                    size="sm"
                    disabled={!statusChanged || saving !== null}
                    onClick={() => void saveStatus()}
                  >
                    {saving === 'status' ? (
                      <Spinner data-icon="inline-start" />
                    ) : null}
                    Simpan status
                  </Button>
                </div>
              </section>

              <Separator />

              <section className="flex flex-col gap-3">
                <div>
                  <h3 className="text-sm font-medium">Role</h3>
                  <p className="text-sm text-muted-foreground">
                    {canGrantAdmin
                      ? 'Kamu bisa memberikan role USER atau ADMIN.'
                      : 'ADMIN hanya bisa mengelola role USER.'}
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  {options.map((role) => (
                    <Field key={role} orientation="horizontal">
                      <Checkbox
                        id={`role-${role}`}
                        checked={roles.includes(role)}
                        onCheckedChange={() => toggleRole(role)}
                        disabled={saving !== null}
                      />
                      <FieldLabel htmlFor={`role-${role}`}>
                        {roleLabel[role]}
                      </FieldLabel>
                    </Field>
                  ))}
                </div>

                <div>
                  <Button
                    size="sm"
                    disabled={
                      !rolesChanged || roles.length === 0 || saving !== null
                    }
                    onClick={() => void saveRoles()}
                  >
                    {saving === 'roles' ? (
                      <Spinner data-icon="inline-start" />
                    ) : null}
                    Simpan role
                  </Button>
                </div>
              </section>
            </>
          )}
        </div>

        <SheetFooter className="flex-row justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={saving !== null}
          >
            Tutup
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
