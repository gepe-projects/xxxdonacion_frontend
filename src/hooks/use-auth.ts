import type { Role } from '@/lib/api'
import { authStore, hasAnyRole, isAdminUser } from '@/lib/auth-store'
import { authErrorMessage } from '@/lib/errors'
import { useEffect, useSyncExternalStore } from 'react'

export { authErrorMessage }

export function useAuth() {
  const snapshot = useSyncExternalStore(
    authStore.subscribe,
    authStore.getSnapshot,
    authStore.getServerSnapshot,
  )

  useEffect(() => {
    authStore.init()
  }, [])

  return {
    ...snapshot,
    // Hanya menandakan sesi Firebase belum diketahui. Status 'syncing' tidak
    // boleh menyembunyikan nama, karena firebaseUser sudah tersedia.
    loading: snapshot.status === 'loading',
    profileLoading: snapshot.status === 'syncing',
    isAuthenticated: snapshot.status === 'authenticated',
    isAdmin: isAdminUser(snapshot.user),
    signInWithEmail: authStore.signInWithEmail,
    signInWithGoogle: authStore.signInWithGoogle,
    register: authStore.register,
    signOut: authStore.signOut,
    refresh: () => authStore.syncUser(true),
    clearError: authStore.clearError,
    hasRole: (role: Role) => snapshot.user?.roles.includes(role) ?? false,
    hasAnyRole: (roles: Role[]) => hasAnyRole(snapshot.user, roles),
  }
}
