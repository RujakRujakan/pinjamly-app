"use client"

import type { LogAktifitasListParams } from "@/lib/types/log-aktifitas"

import { useState } from "react"
import { PageHeader } from "@/components/layout/page-header"
import { RoleGuard } from "@/components/role-guard"
import { PageSkeleton } from "@/components/shared/loading-skeleton"
import { PaginationControls } from "@/components/shared/pagination-controls"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  useLogAktifitas,
  useLogAktifitasDetail,
} from "@/hooks/use-log-aktifitas"

export default function LogAktifitasPage() {
  return (
    <RoleGuard allowedRoles={["admin"]}>
      <LogAktifitasContent />
    </RoleGuard>
  )
}

function LogAktifitasContent() {
  const [params, setParams] = useState<LogAktifitasListParams>({ page: 1 })
  const [aksiFilter, setAksiFilter] = useState("")
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const { data, isLoading } = useLogAktifitas({
    ...params,
    aksi: aksiFilter || undefined,
  })
  const { data: detailData } = useLogAktifitasDetail(selectedId ?? "")

  if (isLoading) return <PageSkeleton />

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Log Aktifitas"
        description="Riwayat aktifitas seluruh pengguna."
      />

      <div className="flex items-center gap-3">
        <Input
          placeholder="Cari aksi (login, create_alat...)"
          value={aksiFilter}
          onChange={(e) => {
            setAksiFilter(e.target.value)
            setParams((p) => ({ ...p, page: 1 }))
          }}
          className="max-w-xs"
        />
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Aksi</TableHead>
              <TableHead>Pengguna</TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Waktu</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data.map((log) => (
              <TableRow
                key={log.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => setSelectedId(log.id)}
              >
                <TableCell>
                  <Badge variant="outline" className="font-mono text-xs">
                    {log.aksi}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{log.user.name}</span>
                    <span className="text-xs text-muted-foreground capitalize">
                      {log.user.role}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="max-w-[300px] truncate text-sm">
                  {log.deskripsi}
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {log.ip_address}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(log.created_at).toLocaleString("id-ID")}
                </TableCell>
              </TableRow>
            ))}
            {data?.data.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  Belum ada log aktifitas.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {data?.meta && (
        <PaginationControls
          meta={data.meta}
          onPageChange={(p) => setParams((prev) => ({ ...prev, page: p }))}
        />
      )}

      <Sheet
        open={!!selectedId}
        onOpenChange={(open) => !open && setSelectedId(null)}
      >
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Detail Log</SheetTitle>
            <SheetDescription>
              Informasi lengkap log aktifitas.
            </SheetDescription>
          </SheetHeader>
          {detailData?.data && (
            <div className="mt-6 flex flex-col gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Aksi</p>
                <Badge variant="outline" className="mt-1 font-mono">
                  {detailData.data.aksi}
                </Badge>
              </div>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground">Deskripsi</p>
                <p className="mt-1 text-sm">{detailData.data.deskripsi}</p>
              </div>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground">Pengguna</p>
                <p className="mt-1 text-sm">
                  {detailData.data.user.name} ({detailData.data.user.role})
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground">Model</p>
                <p className="mt-1 font-mono text-sm">
                  {detailData.data.model_type ?? "—"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {detailData.data.model_id ?? "—"}
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground">IP Address</p>
                <p className="mt-1 font-mono text-sm">
                  {detailData.data.ip_address}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Waktu</p>
                <p className="mt-1 text-sm">
                  {new Date(detailData.data.created_at).toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
