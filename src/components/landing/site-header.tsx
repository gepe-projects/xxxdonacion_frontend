import { buttonVariants } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/hooks/use-auth'
import { Link } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'

export function SiteHeader() {
  const { firebaseUser, user: profile, loading, isAdmin } = useAuth()
  const name =
    profile?.name?.trim() ||
    firebaseUser?.displayName?.trim() ||
    profile?.email.split('@')[0] ||
    firebaseUser?.email?.split('@')[0] ||
    'Akun'

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground">
            x
          </span>
          <span className="text-sm font-medium tracking-tight">
            xxxdonacion
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <a href="#fitur" className="transition-colors hover:text-foreground">
            Fitur
          </a>
          <a
            href="#cara-kerja"
            className="transition-colors hover:text-foreground"
          >
            Cara kerja
          </a>
        </nav>

        {loading ? (
          <Skeleton className="h-8 w-24 rounded-full" />
        ) : firebaseUser ? (
          <Link
            to={isAdmin ? '/admin' : '/dashboard'}
            className={buttonVariants({ variant: 'outline', size: 'sm' })}
          >
            <span className="max-w-32 truncate">{name}</span>
            <ArrowUpRight data-icon="inline-end" />
          </Link>
        ) : (
          <Link
            to="/login"
            search={{ redirect: '/dashboard' }}
            className={buttonVariants({ variant: 'outline', size: 'sm' })}
          >
            Masuk
          </Link>
        )}
      </div>
    </header>
  )
}
