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
    loading: snapshot.status === 'loading' || snapshot.status === 'syncing',
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
