import type { User as FirebaseUser } from 'firebase/auth'
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth'
import { auth } from './firebase'
import type { IdentityUser, Role } from './api'
import { identityApi } from './api'
import { AuthFlowError, EMAIL_NOT_VERIFIED, authErrorMessage } from './errors'

export type AuthStatus =
  'loading' | 'unauthenticated' | 'syncing' | 'authenticated' | 'error'

export type AuthSnapshot = {
  status: AuthStatus
  firebaseUser: FirebaseUser | null
  user: IdentityUser | null
  error: string | null
}

export type RegisterInput = {
  email: string
  password: string
  name: string
}

const initialState: AuthSnapshot = {
  status: 'loading',
  firebaseUser: null,
  user: null,
  error: null,
}

/**
 * Backend boleh mengubah role/status kapan saja. Cache pendek ini hanya untuk
 * mencegah `/sync` dipanggil berulang saat navigasi antar halaman.
 */
const SYNC_TTL_MS = 60_000

let initialized = false
let state: AuthSnapshot = initialState
const listeners = new Set<() => void>()

let cachedUser: IdentityUser | null = null
let cachedUid: string | null = null
let cachedAt = 0
let syncPromise: Promise<IdentityUser> | null = null
/** Naik setiap sesi Firebase berubah, supaya hasil sync lama tidak menimpa. */
let authGeneration = 0

function setState(patch: Partial<AuthSnapshot>) {
  state = { ...state, ...patch }
  for (const listener of listeners) listener()
}

function resetCache() {
  authGeneration += 1
  cachedUser = null
  cachedUid = null
  cachedAt = 0
  syncPromise = null
}

function init() {
  if (initialized || typeof window === 'undefined') return
  initialized = true

  onAuthStateChanged(auth, (firebaseUser) => {
    const previousUid = state.firebaseUser?.uid ?? null
    const nextUid = firebaseUser?.uid ?? null

    // Naikkan epoch hanya saat identitas benar-benar berganti. Emisi ulang
    // untuk UID yang sama (mis. updateProfile) tidak boleh membatalkan sync
    // yang sedang berjalan.
    if (nextUid !== previousUid) authGeneration += 1

    if (!firebaseUser) {
      resetCache()
      setState({
        status: 'unauthenticated',
        firebaseUser: null,
        user: null,
        error: null,
      })
      return
    }

    const cached = cachedUid === firebaseUser.uid ? cachedUser : null
    setState({
      status: cached ? 'authenticated' : 'syncing',
      firebaseUser,
      user: cached,
      error: null,
    })

    // Aplikasi baru dibuka / di-refresh: sesi Firebase dipulihkan di sini.
    // Ini satu-satunya pemicu /identities/sync; navigasi antar halaman
    // memakai cache profil in-memory.
    void hydrateProfile()
  })
}

/**
 * Sinkronisasi profil Firebase ke backend. Ini yang mengisi role user di
 * frontend. Panggil dengan `force` setelah login/register.
 */
async function syncUser(force = false): Promise<IdentityUser> {
  init()
  await auth.authStateReady()

  const firebaseUser = auth.currentUser
  if (!firebaseUser) {
    resetCache()
    setState({
      status: 'unauthenticated',
      firebaseUser: null,
      user: null,
      error: null,
    })
    throw new AuthFlowError(
      'auth-flow/unauthenticated',
      'Kamu belum masuk. Silakan login.',
    )
  }

  if (syncPromise) return syncPromise

  const cached = cachedUser
  const cacheIsFresh =
    !force &&
    cachedUid === firebaseUser.uid &&
    cached !== null &&
    Date.now() - cachedAt < SYNC_TTL_MS

  if (cacheIsFresh) {
    setState({
      status: 'authenticated',
      firebaseUser,
      user: cached,
      error: null,
    })
    return cached
  }

  setState({
    status: 'syncing',
    firebaseUser,
    user: cachedUid === firebaseUser.uid ? cachedUser : null,
    error: null,
  })

  const generation = authGeneration
  const promise = identityApi
    .sync()
    .then((user) => {
      if (
        generation !== authGeneration ||
        auth.currentUser?.uid !== firebaseUser.uid
      ) {
        throw new AuthFlowError(
          'auth-flow/stale',
          'Sesi login berubah. Silakan coba lagi.',
        )
      }

      cachedUser = user
      cachedUid = firebaseUser.uid
      cachedAt = Date.now()
      setState({
        status: 'authenticated',
        firebaseUser,
        user,
        error: null,
      })
      return user
    })
    .catch((error: unknown) => {
      if (generation === authGeneration) {
        setState({
          status: 'error',
          firebaseUser: auth.currentUser,
          user: null,
          error: authErrorMessage(error),
        })
      }
      throw error
    })
    .finally(() => {
      // Bandingkan identitas promise, bukan generation: sync stale tidak boleh
      // meninggalkan promise mati untuk pemanggil berikutnya.
      if (syncPromise === promise) syncPromise = null
    })

  syncPromise = promise
  return promise
}

/**
 * Hidrasi profil backend saat sesi Firebase selesai dipulihkan (buka/refresh
 * aplikasi). Navigasi antar halaman tidak memanggil ini — cache in-memory
 * dipakai ulang. Tidak pernah melempar error supaya aman dipanggil dari
 * listener auth.
 */
async function hydrateProfile(): Promise<IdentityUser | null> {
  if (typeof window === 'undefined') return null

  const firebaseUser = auth.currentUser
  if (!firebaseUser) return null

  // Backend mensyaratkan email_verified=true pada token. Jangan buang kuota
  // /sync untuk sesi yang pasti ditolak (mis. tepat setelah register).
  if (!firebaseUser.emailVerified) return null

  // Jangan retry otomatis setelah gagal pada sesi yang sama.
  if (
    state.status === 'error' &&
    state.firebaseUser?.uid === firebaseUser.uid
  ) {
    return null
  }

  try {
    return await syncUser()
  } catch {
    return null // error sudah disimpan di state
  }
}

/**
 * Dipakai route guard. Mengembalikan user backend kalau sesi valid, atau null
 * kalau belum login / sync gagal. Error sync disimpan di state supaya bisa
 * ditampilkan di halaman login.
 */
async function ensureSession(): Promise<IdentityUser | null> {
  // Sesi Firebase hanya ada di browser. Saat SSR/prerender anggap belum login
  // dan biarkan guard berjalan lagi setelah hidrasi di client.
  if (typeof window === 'undefined') return null

  init()
  await auth.authStateReady()

  const firebaseUser = auth.currentUser
  if (!firebaseUser) {
    resetCache()
    setState({
      status: 'unauthenticated',
      firebaseUser: null,
      user: null,
      error: null,
    })
    return null
  }

  if (cachedUid === firebaseUser.uid && cachedUser) {
    setState({
      status: 'authenticated',
      firebaseUser,
      user: cachedUser,
      error: null,
    })
    return cachedUser
  }

  // Jangan retry otomatis setelah gagal, supaya tidak membanjiri `/sync`
  // (rate limit 10/menit) ketika user membuka halaman login.
  if (
    state.status === 'error' &&
    state.firebaseUser?.uid === firebaseUser.uid
  ) {
    return null
  }

  try {
    return await syncUser()
  } catch {
    return null
  }
}

async function signInWithEmail(email: string, password: string) {
  init()
  clearError()

  const credential = await signInWithEmailAndPassword(auth, email, password)
  const firebaseUser = credential.user

  // Backend mensyaratkan email_verified=true pada token saat sync.
  if (!firebaseUser.emailVerified) {
    await sendEmailVerification(firebaseUser).catch(() => undefined)
    await firebaseSignOut(auth)
    throw new AuthFlowError(
      EMAIL_NOT_VERIFIED,
      'Email belum diverifikasi. Kami kirim ulang tautan verifikasi — cek kotak masuk, verifikasi, lalu masuk lagi.',
    )
  }

  try {
    return await syncUser(true)
  } catch (error) {
    await firebaseSignOut(auth).catch(() => undefined)
    throw error
  }
}

async function signInWithGoogle() {
  init()
  clearError()

  await signInWithPopup(auth, new GoogleAuthProvider())
  try {
    return await syncUser(true)
  } catch (error) {
    await firebaseSignOut(auth).catch(() => undefined)
    throw error
  }
}

async function register({ email, password, name }: RegisterInput) {
  init()
  clearError()

  const credential = await createUserWithEmailAndPassword(auth, email, password)
  const firebaseUser = credential.user

  if (name.trim()) {
    await updateProfile(firebaseUser, { displayName: name.trim() })
  }

  if (firebaseUser.emailVerified) {
    try {
      await syncUser(true)
    } catch (error) {
      await firebaseSignOut(auth).catch(() => undefined)
      throw error
    }
    return { requiresVerification: false }
  }

  try {
    await sendEmailVerification(firebaseUser)
  } finally {
    await firebaseSignOut(auth).catch(() => undefined)
  }

  return { requiresVerification: true }
}

async function signOut() {
  await firebaseSignOut(auth)
  resetCache()
  setState({
    status: 'unauthenticated',
    firebaseUser: null,
    user: null,
    error: null,
  })
}

function clearError() {
  if (!state.error) return
  setState({
    error: null,
    status: state.user ? 'authenticated' : 'unauthenticated',
  })
}

function subscribe(listener: () => void) {
  init()
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function getSnapshot() {
  return state
}

function getServerSnapshot() {
  return initialState
}

export function hasAnyRole(user: IdentityUser | null, roles: Role[]) {
  if (!user || roles.length === 0) return false
  return roles.some((role) => user.roles.includes(role))
}

export function isAdminUser(user: IdentityUser | null) {
  return (
    user !== null &&
    (user.roles.includes('ADMIN') || user.roles.includes('SUPER_ADMIN'))
  )
}

export const authStore = {
  init,
  subscribe,
  getSnapshot,
  getServerSnapshot,
  ensureSession,
  syncUser,
  signInWithEmail,
  signInWithGoogle,
  register,
  signOut,
  clearError,
  hasAnyRole,
}

export type AuthStore = typeof authStore
