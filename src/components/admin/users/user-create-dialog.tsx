import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { adminApi } from '@/lib/api'
import type { IdentityUser } from '@/lib/api'
import { apiErrorMessage } from '@/lib/errors'
import { useState } from 'react'

type UserCreateDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: (user: IdentityUser) => void
}

export function UserCreateDialog({
  open,
  onOpenChange,
  onCreated,
}: UserCreateDialogProps) {
  const [form, setForm] = useState({ email: '', name: '', password: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const created = await adminApi.createUser({
        email: form.email,
        name: form.name,
        ...(form.password ? { password: form.password } : {}),
      })
      setForm({ email: '', name: '', password: '' })
      onCreated(created)
    } catch (err) {
      setError(apiErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} disablePointerDismissal>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah user</DialogTitle>
          <DialogDescription>
            Buat akun dan data user baru di platform. User baru selalu mendapat
            role USER.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="create-name">Nama</FieldLabel>
              <Input
                id="create-name"
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                maxLength={100}
                disabled={saving}
                placeholder="Nama user"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="create-email">Email</FieldLabel>
              <Input
                id="create-email"
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
                required
                disabled={saving}
                placeholder="user@email.com"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="create-password">
                Password (opsional)
              </FieldLabel>
              <Input
                id="create-password"
                type="password"
                minLength={12}
                value={form.password}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    password: event.target.value,
                  }))
                }
                autoComplete="new-password"
                disabled={saving}
                placeholder="Minimal 12 karakter"
              />
            </Field>
          </FieldGroup>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              Batal
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? <Spinner data-icon="inline-start" /> : null}
              Buat user
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
