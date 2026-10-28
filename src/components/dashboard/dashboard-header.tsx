import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { useRouterState } from '@tanstack/react-router'
import { getNavTitle } from './nav-items'
import type { NavItem } from './nav-items'

export function DashboardHeader({ items }: { items: NavItem[] }) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" />
      <span className="truncate text-sm font-medium">
        {getNavTitle(items, pathname)}
      </span>
    </header>
  )
}
