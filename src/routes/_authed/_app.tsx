import { DashboardShell } from '@/components/dashboard/dashboard-shell'
import { userNavItems } from '@/components/dashboard/user-nav-items'
import { isAdminUser } from '@/lib/auth-store'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/_app')({
  beforeLoad: async ({ context }) => {
    const user = await context.auth.ensureSession()

    // Admin punya area sendiri. Jangan tampilkan dashboard user ke admin.
    if (isAdminUser(user)) {
      throw redirect({ to: '/admin' })
    }
  },
  component: AppLayout,
})

function AppLayout() {
  return (
    <DashboardShell
      navItems={userNavItems}
      homeTo="/dashboard"
      subtitle="Creator dashboard"
    >
      <Outlet />
    </DashboardShell>
  )
}
