import { adminApi } from './api'
import type { IdentityUser } from './api'

/**
 * Cache kecil untuk detail user. Backend belum punya endpoint get-by-id, jadi
 * data dari halaman list dipakai dulu. Kalau halaman detail dibuka langsung
 * (refresh/bookmark), daftar user di-scan sampai ID ditemukan.
 */
const users = new Map<string, IdentityUser>()

export function rememberUsers(items: IdentityUser[]) {
  for (const user of items) users.set(user.id, user)
}

export function rememberUser(user: IdentityUser) {
  users.set(user.id, user)
}

export function forgetUser(id: string) {
  users.delete(id)
}

export function getCachedUser(id: string) {
  return users.get(id) ?? null
}

export async function findUserById(id: string) {
  const cached = users.get(id)
  if (cached) return cached

  let cursor: string | undefined

  for (let page = 0; page < 50; page++) {
    const result = await adminApi.listUsers({ limit: 100, cursor })
    rememberUsers(result.items)

    const found = users.get(id)
    if (found) return found
    if (!result.has_more || !result.next_cursor) return null
    cursor = result.next_cursor
  }

  return null
}
