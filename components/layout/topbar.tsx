"use client"

import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

const pathLabels: Record<string, string> = {
  dashboard: "Dashboard",
  users: "Pengguna",
  kategoris: "Kategori",
  alats: "Alat",
  peminjamans: "Peminjaman",
  pengembalians: "Pengembalian",
  "log-aktifitas": "Log Aktifitas",
  laporan: "Laporan",
}

export function Topbar() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)
  const currentSegment = segments[segments.length - 1] || "dashboard"
  const pageTitle = pathLabels[currentSegment] || currentSegment

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Pinjamly</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  )
}
