import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { useAuth } from '@/hooks/use-auth'
import { useNavigate } from '@tanstack/react-router'
import { ChevronsUpDown, LogOut, Settings } from 'lucide-react'

function getInitials(value: string) {
  const parts = value.trim().split(/\s+/).slice(0, 2)
  const initials = parts.map((part) => part[0].toUpperCase()).join('')
  return initials || '?'
}

const roleLabel = {
  USER: 'User',
  ADMIN: 'Admin',
  SUPER_ADMIN: 'Super Admin',
} as const

export function NavUser({ isAdminArea = false }: { isAdminArea?: boolean }) {
  const { firebaseUser, user: profile, signOut } = useAuth()
  const { isMobile } = useSidebar()
  const navigate = useNavigate()

  if (!firebaseUser) {
    return null
  }

  const email = profile?.email ?? firebaseUser.email ?? ''
  const fallbackName = email.split('@')[0]
  const name =
    profile?.name || firebaseUser.displayName || fallbackName || 'Akun'
  const initials = getInitials(name)

  async function handleSignOut() {
    await signOut()
    await navigate({
      to: '/login',
      search: { redirect: '/dashboard' },
      replace: true,
    })
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<SidebarMenuButton size="lg" className="h-14" />}
          >
            <Avatar className="rounded-lg">
              {firebaseUser.photoURL ? (
                <AvatarImage src={firebaseUser.photoURL} alt={name} />
              ) : null}
              <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{name}</span>
              <span className="truncate text-xs text-sidebar-foreground/70">
                {email}
              </span>
            </div>
            <ChevronsUpDown className="ml-auto" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-56 rounded-xl"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="rounded-lg">
                    {firebaseUser.photoURL ? (
                      <AvatarImage src={firebaseUser.photoURL} alt={name} />
                    ) : null}
                    <AvatarFallback className="rounded-lg">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {email}
                    </span>
                    {profile ? (
                      <span className="mt-1 flex flex-wrap gap-1">
                        {profile.roles.map((role) => (
                          <Badge
                            key={role}
                            variant={
                              role === 'SUPER_ADMIN' ? 'default' : 'secondary'
                            }
                            className="h-4 px-1.5 text-[10px]"
                          >
                            {roleLabel[role]}
                          </Badge>
                        ))}
                      </span>
                    ) : null}
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            {!isAdminArea ? (
              <>
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => void navigate({ to: '/pengaturan/profil' })}
                  >
                    <Settings />
                    Pengaturan akun
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
              </>
            ) : null}
            <DropdownMenuItem
              variant="destructive"
              onClick={() => void handleSignOut()}
            >
              <LogOut />
              Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
