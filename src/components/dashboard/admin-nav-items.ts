import { LayoutDashboard, Users } from 'lucide-react'
import type { NavItem } from './nav-items'

/**
 * Navigasi khusus area admin. Area admin sengaja tidak punya link kembali ke
 * dashboard user supaya benar-benar terpisah.
 */
export const adminNavItems: NavItem[] = [
  {
    title: 'Dashboard Admin',
    to: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Kelola Pengguna',
    to: '/admin/users',
    icon: Users,
  },
]
