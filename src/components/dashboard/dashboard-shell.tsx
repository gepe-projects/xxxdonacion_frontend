import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import type { ReactNode } from 'react'
import { AppSidebar } from './app-sidebar'
import { DashboardHeader } from './dashboard-header'
import type { AppPath, NavItem } from './nav-items'

type DashboardShellProps = {
  children: ReactNode
  navItems: NavItem[]
  homeTo: AppPath
  subtitle: string
  isAdminArea?: boolean
}

export function DashboardShell({
  children,
  navItems,
  homeTo,
  subtitle,
  isAdminArea = false,
}: DashboardShellProps) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar
          navItems={navItems}
          homeTo={homeTo}
          subtitle={subtitle}
          isAdminArea={isAdminArea}
        />
        <SidebarInset>
          <DashboardHeader items={navItems} />
          <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
