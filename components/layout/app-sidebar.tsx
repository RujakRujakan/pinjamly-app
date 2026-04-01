"use client"

import type { UserRole } from "@/lib/types/user"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useLogout } from "@/hooks/use-auth"
import { useAuthStore } from "@/stores/auth-store"
import {
  ArrowTurnBackwardIcon,
  ChartLineData01Icon,
  CheckListIcon,
  DashboardSquare02Icon,
  Folder01Icon,
  Task01Icon,
  UserGroupIcon,
  Wrench01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

interface NavItem {
  title: string
  href: string
  icon: typeof DashboardSquare02Icon
  roles: UserRole[]
}

const navMain: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: DashboardSquare02Icon,
    roles: ["admin", "petugas", "peminjam"],
  },
  {
    title: "Alat",
    href: "/alats",
    icon: Wrench01Icon,
    roles: ["admin", "petugas", "peminjam"],
  },
  {
    title: "Peminjaman",
    href: "/peminjamans",
    icon: CheckListIcon,
    roles: ["admin", "petugas", "peminjam"],
  },
]

const navManagement: NavItem[] = [
  { title: "Pengguna", href: "/users", icon: UserGroupIcon, roles: ["admin"] },
  {
    title: "Kategori",
    href: "/kategoris",
    icon: Folder01Icon,
    roles: ["admin", "petugas"],
  },
  {
    title: "Pengembalian",
    href: "/pengembalians",
    icon: ArrowTurnBackwardIcon,
    roles: ["admin", "petugas"],
  },
]

const navReporting: NavItem[] = [
  {
    title: "Laporan",
    href: "/laporan",
    icon: ChartLineData01Icon,
    roles: ["admin", "petugas"],
  },
  {
    title: "Log Aktifitas",
    href: "/log-aktifitas",
    icon: Task01Icon,
    roles: ["admin"],
  },
]

function filterByRole(items: NavItem[], role: UserRole | null) {
  if (!role) return []
  return items.filter((item) => item.roles.includes(role))
}

export function AppSidebar() {
  const pathname = usePathname()
  const user = useAuthStore((s) => s.user)
  const role = user?.role ?? null
  const logout = useLogout()

  const mainItems = filterByRole(navMain, role)
  const managementItems = filterByRole(navManagement, role)
  const reportingItems = filterByRole(navReporting, role)

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "?"

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-3">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
            P
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-sm font-bold">Pinjamly</span>
            <span className="text-[10px] text-muted-foreground">
              Sistem Peminjaman Alat
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {mainItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {mainItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                    >
                      <Link href={item.href}>
                        <HugeiconsIcon icon={item.icon} className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {managementItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Manajemen</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {managementItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                    >
                      <Link href={item.href}>
                        <HugeiconsIcon icon={item.icon} className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {reportingItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Pelaporan</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {reportingItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                    >
                      <Link href={item.href}>
                        <HugeiconsIcon icon={item.icon} className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="h-auto p-2">
                  <Avatar className="size-7">
                    <AvatarFallback className="text-xs">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-left">
                    <span className="max-w-[140px] truncate text-sm font-medium">
                      {user?.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground capitalize">
                      {user?.role}
                    </span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => logout.mutate()}
                  disabled={logout.isPending}
                  className="text-destructive focus:text-destructive"
                >
                  {logout.isPending ? "Logging out..." : "Keluar"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
