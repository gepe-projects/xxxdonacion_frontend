import {
  HandCoins,
  LayoutDashboard,
  MonitorPlay,
  Settings,
  Store,
} from 'lucide-react'
import type { NavItem } from './nav-items'

export const userNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    to: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Donasi',
    basePath: '/donasi',
    icon: HandCoins,
    items: [
      { title: 'Semua Donasi', to: '/donasi' },
      { title: 'Riwayat', to: '/donasi/riwayat' },
    ],
  },
  {
    title: 'Overlay',
    to: '/overlay',
    icon: MonitorPlay,
  },
  {
    title: 'Marketplace',
    to: '/marketplace',
    icon: Store,
  },
  {
    title: 'Pengaturan',
    basePath: '/pengaturan',
    icon: Settings,
    items: [
      { title: 'Profil', to: '/pengaturan/profil' },
      { title: 'Rekening', to: '/pengaturan/rekening' },
    ],
  },
]
