import type { Role } from '@/lib/api'
import type { FileRouteTypes } from '@/routeTree.gen'
import type { LucideIcon } from 'lucide-react'

export type AppPath = FileRouteTypes['to']

export type NavSubItem = {
  title: string
  to: AppPath
}

type NavVisibility = {
  /** Kosong berarti semua user yang sudah login boleh melihat menu ini. */
  roles?: Role[]
}

export type NavLinkItem = NavVisibility & {
  title: string
  icon: LucideIcon
  to: AppPath
}

export type NavParentItem = NavVisibility & {
  title: string
  icon: LucideIcon
  basePath: string
  items: NavSubItem[]
}

export type NavItem = NavLinkItem | NavParentItem

export function normalizePathname(pathname: string) {
  return pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
}

/** Menu dengan `roles` hanya tampil kalau user punya salah satu role itu. */
export function isNavItemAllowed(item: NavItem, userRoles: Role[]) {
  if (!item.roles || item.roles.length === 0) return true
  return item.roles.some((role) => userRoles.includes(role))
}

export function isNavItemActive(item: NavItem, pathname: string) {
  const current = normalizePathname(pathname)

  if ('items' in item) {
    return current === item.basePath || current.startsWith(`${item.basePath}/`)
  }

  return item.to === current
}

/**
 * Ambil judul dari item yang paling spesifik. Ini penting untuk halaman detail
 * seperti `/admin/users/:id` supaya tetap tampil sebagai "Kelola Pengguna",
 * bukan "Dashboard".
 */
export function getNavTitle(items: NavItem[], pathname: string) {
  const current = normalizePathname(pathname)
  let bestTitle = 'Dashboard'
  let bestLength = -1

  function consider(title: string, prefix: string) {
    const matches = current === prefix || current.startsWith(`${prefix}/`)
    if (matches && prefix.length > bestLength) {
      bestTitle = title
      bestLength = prefix.length
    }
  }

  for (const item of items) {
    if ('items' in item) {
      for (const subItem of item.items) consider(subItem.title, subItem.to)
      consider(item.title, item.basePath)
      continue
    }

    consider(item.title, item.to)
  }

  return bestTitle
}
