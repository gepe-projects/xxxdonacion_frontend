import { requireAuth } from '@/lib/route-guards'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed')({
  beforeLoad: ({ context, location }) => requireAuth(context, location),
  component: () => <Outlet />,
})
