import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { authErrorMessage, useAuth } from '@/hooks/use-auth'
import type { IdentityUser } from '@/lib/api'
import { isAdminUser } from '@/lib/auth-store'
import {
  Link,
  createFileRoute,
  redirect,
  useRouter,
} from '@tanstack/react-router'
import { useState } from 'react'

function sanitizeRedirect(value: unknown) {
  // Hanya izinkan path internal dan jangan kembali ke halaman auth sendiri.
  const isInternalPath =
    typeof value === 'string' &&
    value.startsWith('/') &&
    !value.startsWith('//') &&
    value !== '/' &&
    !value.startsWith('/login') &&
    !value.startsWith('/register')

  return isInternalPath ? value : '/dashboard'
}

export const Route = createFileRoute('/login')({
  validateSearch: (search) => ({
    redirect: sanitizeRedirect(search.redirect),
  }),
  beforeLoad: async ({ context, search }) => {
    // Sudah login + sudah sync? Jangan tampilkan halaman login lagi.
    const user = await context.auth.ensureSession()
    if (user) {
      const target =
        isAdminUser(user) && search.redirect === '/dashboard'
          ? '/admin'
          : search.redirect
      throw redirect({ href: target })
    }
  },
  component: LoginPage,
})

function LoginPage() {
  const { redirect: redirectTo } = Route.useSearch()
  const router = useRouter()
  const { signInWithEmail, signInWithGoogle, error: sessionError } = useAuth()
  const [pending, setPending] = useState<'credentials' | 'google' | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function run(
    action: () => Promise<IdentityUser>,
    provider: 'credentials' | 'google',
  ) {
    setError(null)
    setPending(provider)
    try {
      const user = await action()
      const target =
        isAdminUser(user) && redirectTo === '/dashboard' ? '/admin' : redirectTo
      await router.history.push(target)
    } catch (err) {
      setError(authErrorMessage(err))
      setPending(null)
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const email = String(form.get('email'))
    const password = String(form.get('password'))
    void run(() => signInWithEmail(email, password), 'credentials')
  }

  function handleGoogle() {
    void run(signInWithGoogle, 'google')
  }

  const isPending = pending !== null
  const visibleError = error ?? sessionError

  return (
    <div className="flex min-h-svh items-center justify-center bg-muted/40 p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Masuk</CardTitle>
          <CardDescription>
            Masuk untuk melanjutkan ke akun kamu. Belum punya akun?{' '}
            <Link
              to="/register"
              className="font-medium text-foreground underline underline-offset-4"
            >
              Daftar
            </Link>
          </CardDescription>
        </CardHeader>

        <CardContent>
          {visibleError && (
            <Alert variant="destructive" className="mb-5">
              <AlertDescription>{visibleError}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <FieldGroup className="gap-4">
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="nama@email.com"
                  required
                  disabled={isPending}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  disabled={isPending}
                />
              </Field>

              <Button type="submit" disabled={isPending}>
                {pending === 'credentials' && (
                  <Spinner data-icon="inline-start" />
                )}
                Masuk
              </Button>

              <FieldSeparator>atau</FieldSeparator>

              <Button
                type="button"
                variant="outline"
                onClick={handleGoogle}
                disabled={isPending}
              >
                {pending === 'google' ? (
                  <Spinner data-icon="inline-start" />
                ) : (
                  <GoogleIcon />
                )}
                Lanjutkan dengan Google
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.63h6.46a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.58-5.17 3.58-8.8Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.08 7.94-2.93l-3.88-3c-1.08.72-2.45 1.15-4.06 1.15-3.13 0-5.78-2.11-6.72-4.96H1.27v3.1A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.26a7.2 7.2 0 0 1 0-4.52v-3.1H1.27a12 12 0 0 0 0 10.72l4.01-3.1Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.34.6 4.59 1.8l3.44-3.44A11.97 11.97 0 0 0 1.27 6.64l4.01 3.1C6.22 6.88 8.87 4.77 12 4.77Z"
      />
    </svg>
  )
}
