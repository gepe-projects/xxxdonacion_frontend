import { redirect } from '@tanstack/react-router'
import type { IdentityUser, Role } from './api'
import { hasAnyRole } from './auth-store'
import type { RouterContext } from './router-context'

type LocationLike = {
  href: string
}

/**
 * Pastikan user sudah login DAN sudah tersinkron ke backend.
 * Kalau belum, redirect ke login sambil menyimpan tujuan awal.
 */
export async function requireAuth(
  context: RouterContext,
  location: LocationLike,
): Promise<IdentityUser> {
  const user = await context.auth.ensureSession()

  if (!user) {
    throw redirect({
      to: '/login',
      search: { redirect: location.href },
    })
  }

  return user
}

/**
 * Otorisasi halaman berbasis role. Menerima lebih dari satu role dan lolos
 * kalau user memiliki salah satunya.
 *
 * Contoh:
 *   beforeLoad: ({ context, location }) =>
 *     requireRoles(context, location, ['ADMIN', 'SUPER_ADMIN'])
 */
export async function requireRoles(
  context: RouterContext,
  location: LocationLike,
  roles: Role[],
): Promise<IdentityUser> {
  const user = await requireAuth(context, location)

  if (!hasAnyRole(user, roles)) {
    throw redirect({ to: '/forbidden' })
  }

  return user
}

/**
 * Versi ringkas untuk opsi `beforeLoad` di route.
 *
 *   beforeLoad: authorizePage(['ADMIN', 'SUPER_ADMIN'])
 */
export function authorizePage(roles: Role[]) {
  return ({
    context,
    location,
  }: {
    context: RouterContext
    location: LocationLike
  }) => requireRoles(context, location, roles)
}
