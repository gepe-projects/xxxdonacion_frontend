import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { Link } from '@tanstack/react-router'
import { Sparkles } from 'lucide-react'
import { NavMain } from './nav-main'
import { NavUser } from './nav-user'
import type { AppPath, NavItem } from './nav-items'

type AppSidebarProps = {
  navItems: NavItem[]
  homeTo: AppPath
  subtitle: string
  isAdminArea?: boolean
}

export function AppSidebar({
  navItems,
  homeTo,
  subtitle,
  isAdminArea = false,
}: AppSidebarProps) {
  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={<Link to={homeTo} />}
              tooltip="xxxdonacion"
            >
              <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Sparkles />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">xxxdonacion</span>
                <span className="truncate text-xs text-sidebar-foreground/70">
                  {subtitle}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="[scrollbar-gutter:stable]">
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser isAdminArea={isAdminArea} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
