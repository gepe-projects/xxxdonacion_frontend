import { Link } from '@tanstack/react-router'

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-3 px-6 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center">
        <p>
          <span className="font-medium text-foreground">xxxdonacion</span> —
          donasi, overlay, dan marketplace untuk kreator.
        </p>
        <Link
          to="/login"
          search={{ redirect: '/dashboard' }}
          className="transition-colors hover:text-foreground"
        >
          Masuk
        </Link>
      </div>
    </footer>
  )
}
