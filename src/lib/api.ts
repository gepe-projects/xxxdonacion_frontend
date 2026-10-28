import { env } from '@/env'
import { auth } from './firebase'

export type Role = 'USER' | 'ADMIN' | 'SUPER_ADMIN'
export type UserStatus = 'ACTIVE' | 'DISABLED'

/** User yang tersimpan di database backend (hasil `/identities/sync`). */
export type IdentityUser = {
  id: string
  email: string
  name?: string
  status: UserStatus
  roles: Role[]
}

/** Identity mentah dari token Firebase (`/identities/me`). */
export type Identity = {
  uid: string
  email: string
  name: string
  email_verified: boolean
}

export type Page<T> = {
  items: T[]
  next_cursor?: string
  has_more: boolean
}

export type CreateUserInput = {
  email: string
  name?: string
  password?: string
}

export class ApiError extends Error {
  readonly status: number
  readonly details?: unknown
  readonly retryAfter?: number

  constructor(
    status: number,
    message: string,
    details?: unknown,
    retryAfter?: number,
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
    this.retryAfter = retryAfter
  }
}

type ErrorBody = {
  message?: string
  errors?: unknown
}

const BASE = env.VITE_API_BASE_URL.replace(/\/+$/, '')

function parseRetryAfter(value: string | null) {
  if (!value) return undefined
  const seconds = Number(value)
  return Number.isFinite(seconds) ? seconds : undefined
}

async function request<T>(
  path: string,
  init: RequestInit,
  forceRefresh = false,
): Promise<T> {
  // getIdToken() sudah meng-cache dan auto-refresh sebelum expired (±1 jam),
  // jadi panggil per request dan jangan disimpan sendiri.
  const token = await auth.currentUser?.getIdToken(forceRefresh)

  const headers = new Headers(init.headers)
  headers.set('Content-Type', 'application/json')
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const res = await fetch(`${BASE}${path}`, { ...init, headers })

  const text = await res.text()
  let body: unknown = null
  if (text) {
    try {
      body = JSON.parse(text)
    } catch {
      body = null
    }
  }

  if (!res.ok) {
    const error = body as ErrorBody | null
    throw new ApiError(
      res.status,
      error?.message ?? `API ${res.status}`,
      error?.errors,
      parseRetryAfter(res.headers.get('Retry-After')),
    )
  }

  return (body as { data: T } | null)?.data as T
}

/** Request ke backend, retry sekali dengan token baru kalau 401. */
async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  try {
    return await request<T>(path, init)
  } catch (error) {
    if (error instanceof ApiError && error.status === 401 && auth.currentUser) {
      return request<T>(path, init, true)
    }
    throw error
  }
}

export const identityApi = {
  /** Provision/link user Firebase ke database. Idempoten. */
  sync: () => api<IdentityUser>('/identities/sync', { method: 'POST' }),

  /** Cek token sekaligus status aktif user di backend. */
  me: () => api<Identity>('/identities/me'),
}

export const adminApi = {
  listUsers: ({ limit, cursor }: { limit?: number; cursor?: string } = {}) => {
    const params = new URLSearchParams()
    if (limit) params.set('limit', String(limit))
    if (cursor) params.set('cursor', cursor)
    const query = params.toString()
    return api<Page<IdentityUser>>(
      `/identities/admin/users${query ? `?${query}` : ''}`,
    )
  },

  createUser: (input: CreateUserInput) =>
    api<IdentityUser>('/identities/admin/users', {
      method: 'POST',
      body: JSON.stringify(input),
    }),

  setUserStatus: (id: string, status: UserStatus) =>
    api<IdentityUser>(`/identities/admin/users/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  setUserRoles: (id: string, roles: Role[]) =>
    api<IdentityUser>(`/identities/admin/users/${id}/roles`, {
      method: 'PUT',
      body: JSON.stringify({ roles }),
    }),

  deleteUser: (id: string) =>
    api<null>(`/identities/admin/users/${id}`, { method: 'DELETE' }),
}
