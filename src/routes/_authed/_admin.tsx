import { adminNavItems } from '@/components/dashboard/admin-nav-items'
import { DashboardShell } from '@/components/dashboard/dashboard-shell'
import { authorizePage } from '@/lib/route-guards'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/_admin')({
  beforeLoad: authorizePage(['ADMIN', 'SUPER_ADMIN']),
  component: AdminLayout,
})

function AdminLayout() {
  return (
    <DashboardShell
      navItems={adminNavItems}
      homeTo="/admin"
      subtitle="Admin panel"
      isAdminArea
    >
      <Outlet />
    </DashboardShell>
  )
}
