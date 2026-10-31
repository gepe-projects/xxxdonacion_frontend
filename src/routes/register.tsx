import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button, buttonVariants } from '@/components/ui/button'
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
import { isAdminUser } from '@/lib/auth-store'
import {
  Link,
  createFileRoute,
  redirect,
  useRouter,
} from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/register')({
  beforeLoad: async ({ context }) => {
    // Kalau sudah login dan tersinkron, tidak perlu daftar lagi.
    const user = await context.auth.ensureSession()
    if (user) {
      throw redirect({ to: isAdminUser(user) ? '/admin' : '/dashboard' })
    }
  },
  component: RegisterPage,
})

function RegisterPage() {
  const router = useRouter()
  const { register, signInWithGoogle, error: sessionError } = useAuth()
  const [pending, setPending] = useState<'credentials' | 'google' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [verificationEmail, setVerificationEmail] = useState<string | null>(
    null,
  )

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const form = new FormData(event.currentTarget)
    const name = String(form.get('name'))
    const email = String(form.get('email'))
    const password = String(form.get('password'))
    const confirmPassword = String(form.get('confirmPassword'))

    if (password !== confirmPassword) {
      setError('Konfirmasi password tidak sama.')
      return
    }

    setPending('credentials')
    try {
      const result = await register({ email, password, name })
      if (result.requiresVerification) {
        setVerificationEmail(email)
      } else {
        await router.history.push('/dashboard')
      }
    } catch (err) {
      setError(authErrorMessage(err))
    } finally {
      setPending(null)
    }
  }

  async function handleGoogle() {
    setError(null)
    setPending('google')
    try {
      // Google selalu menghasilkan email terverifikasi, jadi langsung masuk.
      const user = await signInWithGoogle()
      await router.history.push(isAdminUser(user) ? '/admin' : '/dashboard')
    } catch (err) {
      setError(authErrorMessage(err))
      setPending(null)
    }
  }

  const isPending = pending !== null

  if (verificationEmail) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-muted/40 p-6">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Verifikasi email</CardTitle>
            <CardDescription>
              Akun berhasil dibuat. Satu langkah lagi sebelum bisa masuk.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Alert>
              <AlertTitle>Cek kotak masuk kamu</AlertTitle>
              <AlertDescription>
                Kami mengirim tautan verifikasi ke{' '}
                <span className="font-medium text-foreground">
                  {verificationEmail}
                </span>
                . Setelah email diverifikasi, masuk kembali — data akun akan
                otomatis tersinkron ke server.
              </AlertDescription>
            </Alert>
            <Link
              to="/login"
              search={{ redirect: '/dashboard' }}
              className={buttonVariants()}
            >
              Ke halaman masuk
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const visibleError = error ?? sessionError

  return (
    <div className="flex min-h-svh items-center justify-center bg-muted/40 p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Daftar</CardTitle>
          <CardDescription>
            Buat akun baru. Sudah punya akun?{' '}
            <Link
              to="/login"
              search={{ redirect: '/dashboard' }}
              className="font-medium text-foreground underline underline-offset-4"
            >
              Masuk
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
                <FieldLabel htmlFor="name">Nama</FieldLabel>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Nama kamu"
                  maxLength={100}
                  disabled={isPending}
                />
              </Field>

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
                  autoComplete="new-password"
                  minLength={6}
                  required
                  disabled={isPending}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="confirmPassword">
                  Konfirmasi password
                </FieldLabel>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  minLength={6}
                  required
                  disabled={isPending}
                />
              </Field>

              <Button type="submit" disabled={isPending}>
                {pending === 'credentials' && (
                  <Spinner data-icon="inline-start" />
                )}
                Daftar
              </Button>

              <FieldSeparator>atau</FieldSeparator>

              <Button
                type="button"
                variant="outline"
                onClick={() => void handleGoogle()}
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
