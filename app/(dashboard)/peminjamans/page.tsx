"use client"

import type { FieldErrors } from "@/lib/types/api"
import type {
  PeminjamanListParams,
  PeminjamanStatus,
} from "@/lib/types/peminjaman"

import { useState } from "react"
import { ApproveRejectForm } from "@/components/forms/approve-reject-form"
import { PeminjamanForm } from "@/components/forms/peminjaman-form"
import { PageHeader } from "@/components/layout/page-header"
import { useHasRole } from "@/components/role-guard"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { PageSkeleton } from "@/components/shared/loading-skeleton"
import { PaginationControls } from "@/components/shared/pagination-controls"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  useApprovePeminjaman,
  useCreatePeminjaman,
  useDeletePeminjaman,
  usePeminjamans,
  useRejectPeminjaman,
} from "@/hooks/use-peminjamans"

export default function PeminjamansPage() {
  const isPeminjam = useHasRole("peminjam")
  const isPetugas = useHasRole("petugas")
  const isAdmin = useHasRole("admin")

  const [params, setParams] = useState<PeminjamanListParams>({ page: 1 })
  const [createOpen, setCreateOpen] = useState(false)
  const [arOpen, setArOpen] = useState(false)
  const [arAction, setArAction] = useState<"approve" | "reject">("approve")
  const [arId, setArId] = useState("")
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  const { data, isLoading } = usePeminjamans(params)
  const createPeminjaman = useCreatePeminjaman()
  const deletePeminjaman = useDeletePeminjaman()
  const approvePeminjaman = useApprovePeminjaman()
  const rejectPeminjaman = useRejectPeminjaman()

  function openApproveReject(id: string, action: "approve" | "reject") {
    setArId(id)
    setArAction(action)
    setArOpen(true)
  }

  function handleArSubmit(catatan?: string) {
    const mutation =
      arAction === "approve" ? approvePeminjaman : rejectPeminjaman
    mutation.mutate(
      { id: arId, data: catatan ? { catatan_petugas: catatan } : undefined },
      { onSuccess: () => setArOpen(false) }
    )
  }

  if (isLoading) return <PageSkeleton />

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Peminjaman"
        description={
          isPeminjam ? "Riwayat peminjaman Anda." : "Kelola semua peminjaman."
        }
        actions={
          isPeminjam ? (
            <Button
              onClick={() => {
                setFieldErrors({})
                setCreateOpen(true)
              }}
            >
              Ajukan Peminjaman
            </Button>
          ) : undefined
        }
      />

      <div className="flex items-center gap-3">
        <Select
          value={params.status ?? "all"}
          onValueChange={(v) =>
            setParams({
              ...params,
              status: v === "all" ? undefined : (v as PeminjamanStatus),
              page: 1,
            })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Semua Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="menunggu">Menunggu</SelectItem>
              <SelectItem value="disetujui">Disetujui</SelectItem>
              <SelectItem value="dipinjam">Dipinjam</SelectItem>
              <SelectItem value="ditolak">Ditolak</SelectItem>
              <SelectItem value="dikembalikan">Dikembalikan</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kode</TableHead>
              <TableHead>Alat</TableHead>
              <TableHead>Peminjam</TableHead>
              <TableHead className="text-center">Jumlah</TableHead>
              <TableHead>Tgl Pinjam</TableHead>
              <TableHead>Tgl Kembali</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[120px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-mono text-xs font-medium">
                  {p.kode_peminjaman}
                </TableCell>
                <TableCell>{p.alat.nama_alat}</TableCell>
                <TableCell>{p.peminjam.name}</TableCell>
                <TableCell className="text-center">{p.jumlah}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {p.tanggal_pinjam}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {p.tanggal_kembali_rencana}
                </TableCell>
                <TableCell>
                  <StatusBadge status={p.status} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {isPetugas && p.status === "menunggu" && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openApproveReject(p.id, "approve")}
                        >
                          Setujui
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => openApproveReject(p.id, "reject")}
                        >
                          Tolak
                        </Button>
                      </>
                    )}
                    {isAdmin && (
                      <ConfirmDialog
                        title="Hapus Peminjaman"
                        description={`Yakin ingin menghapus peminjaman ${p.kode_peminjaman}?`}
                        trigger={
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                          >
                            Hapus
                          </Button>
                        }
                        onConfirm={() => deletePeminjaman.mutateAsync(p.id)}
                      />
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {data?.data.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="h-24 text-center text-muted-foreground"
                >
                  Belum ada data peminjaman.
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

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Ajukan Peminjaman</DialogTitle>
            <DialogDescription>
              Pilih alat dan isi detail peminjaman.
            </DialogDescription>
          </DialogHeader>
          <PeminjamanForm
            fieldErrors={fieldErrors}
            isSubmitting={createPeminjaman.isPending}
            onSubmit={(data) => {
              setFieldErrors({})
              createPeminjaman.mutate(data, {
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

      <Dialog open={arOpen} onOpenChange={setArOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {arAction === "approve"
                ? "Setujui Peminjaman"
                : "Tolak Peminjaman"}
            </DialogTitle>
            <DialogDescription>
              {arAction === "approve"
                ? "Peminjaman akan disetujui dan stok akan berkurang."
                : "Peminjaman akan ditolak."}
            </DialogDescription>
          </DialogHeader>
          <ApproveRejectForm
            action={arAction}
            isSubmitting={
              approvePeminjaman.isPending || rejectPeminjaman.isPending
            }
            onSubmit={handleArSubmit}
            onCancel={() => setArOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
