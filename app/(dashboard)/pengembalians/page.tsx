"use client"

import type { FieldErrors } from "@/lib/types/api"

import { useState } from "react"
import { PengembalianForm } from "@/components/forms/pengembalian-form"
import { PageHeader } from "@/components/layout/page-header"
import { RoleGuard, useHasRole } from "@/components/role-guard"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { PageSkeleton } from "@/components/shared/loading-skeleton"
import { PaginationControls } from "@/components/shared/pagination-controls"
import { KondisiBadge } from "@/components/shared/status-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { extractFieldErrors } from "@/hooks/use-auth"
import {
  useCreatePengembalian,
  useDeletePengembalian,
  usePengembalians,
} from "@/hooks/use-pengembalians"

export default function PengembaliansPage() {
  return (
    <RoleGuard allowedRoles={["admin", "petugas"]}>
      <PengembaliansContent />
    </RoleGuard>
  )
}

function PengembaliansContent() {
  const isAdmin = useHasRole("admin")
  const isPetugas = useHasRole("petugas")
  const [page, setPage] = useState(1)
  const [createOpen, setCreateOpen] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  const { data, isLoading } = usePengembalians(page)
  const createPengembalian = useCreatePengembalian()
  const deletePengembalian = useDeletePengembalian()

  function formatCurrency(val: string) {
    const num = parseFloat(val)
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num)
  }

  if (isLoading) return <PageSkeleton />

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Pengembalian"
        description="Data pengembalian alat."
        actions={
          isPetugas || isAdmin ? (
            <Button
              onClick={() => {
                setFieldErrors({})
                setCreateOpen(true)
              }}
            >
              Proses Pengembalian
            </Button>
          ) : undefined
        }
      />

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kode Peminjaman</TableHead>
              <TableHead>Peminjam</TableHead>
              <TableHead>Alat</TableHead>
              <TableHead>Tgl Kembali</TableHead>
              <TableHead>Kondisi</TableHead>
              <TableHead className="text-right">Denda</TableHead>
              <TableHead>Petugas</TableHead>
              {isAdmin && <TableHead className="w-[80px]">Aksi</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data.map((pg) => (
              <TableRow key={pg.id}>
                <TableCell className="font-mono text-xs">
                  {pg.peminjaman.kode_peminjaman}
                </TableCell>
                <TableCell>{pg.peminjaman.peminjam.name}</TableCell>
                <TableCell>{pg.peminjaman.alat.nama_alat}</TableCell>
                <TableCell className="text-sm">{pg.tanggal_kembali}</TableCell>
                <TableCell>
                  <KondisiBadge kondisi={pg.kondisi_alat} />
                </TableCell>
                <TableCell className="text-right">
                  {parseFloat(pg.denda) > 0 ? (
                    <Badge variant="destructive">
                      {formatCurrency(pg.denda)}
                    </Badge>
                  ) : (
                    <span className="text-sm text-muted-foreground">Rp 0</span>
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {pg.petugas.name}
                </TableCell>
                {isAdmin && (
                  <TableCell>
                    <ConfirmDialog
                      title="Hapus Pengembalian"
                      description="Yakin ingin menghapus data pengembalian ini?"
                      trigger={
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                        >
                          Hapus
                        </Button>
                      }
                      onConfirm={() => deletePengembalian.mutateAsync(pg.id)}
                    />
                  </TableCell>
                )}
              </TableRow>
            ))}
            {data?.data.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={isAdmin ? 8 : 7}
                  className="h-24 text-center text-muted-foreground"
                >
                  Belum ada data pengembalian.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {data?.meta && (
        <PaginationControls meta={data.meta} onPageChange={setPage} />
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Proses Pengembalian</DialogTitle>
            <DialogDescription>
              Pilih peminjaman yang dikembalikan.
            </DialogDescription>
          </DialogHeader>
          <PengembalianForm
            fieldErrors={fieldErrors}
            isSubmitting={createPengembalian.isPending}
            onSubmit={(data) => {
              setFieldErrors({})
              createPengembalian.mutate(data, {
                onSuccess: () => setCreateOpen(false),
                onError: (err) => {
                  const fe = extractFieldErrors(err)
                  if (fe) setFieldErrors(fe)
                },
              })
            }}
            onCancel={() => setCreateOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
