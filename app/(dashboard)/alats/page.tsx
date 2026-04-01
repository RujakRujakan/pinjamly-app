"use client"

import type {
  Alat,
  AlatListParams,
  CreateAlatRequest,
  UpdateAlatRequest,
} from "@/lib/types/alat"
import type { FieldErrors } from "@/lib/types/api"

import { useState } from "react"
import { AlatForm } from "@/components/forms/alat-form"
import { PageHeader } from "@/components/layout/page-header"
import { useHasRole } from "@/components/role-guard"
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
import {
  useAlats,
  useCreateAlat,
  useDeleteAlat,
  useUpdateAlat,
} from "@/hooks/use-alats"
import { extractFieldErrors } from "@/hooks/use-auth"
import { useKategoris } from "@/hooks/use-kategoris"

export default function AlatsPage() {
  const isAdmin = useHasRole("admin")
  const [params, setParams] = useState<AlatListParams>({ page: 1 })
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Alat | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  const { data, isLoading } = useAlats(params)
  const { data: kategorisData } = useKategoris(1)
  const createAlat = useCreateAlat()
  const updateAlat = useUpdateAlat()
  const deleteAlat = useDeleteAlat()

  function handleSubmit(formData: CreateAlatRequest | UpdateAlatRequest) {
    setFieldErrors({})
    if (editing) {
      updateAlat.mutate(
        { id: editing.id, data: formData as UpdateAlatRequest },
        {
          onSuccess: () => setDialogOpen(false),
          onError: (err) => {
            const fe = extractFieldErrors(err)
            if (fe) setFieldErrors(fe)
          },
        }
      )
    } else {
      createAlat.mutate(formData as CreateAlatRequest, {
        onSuccess: () => setDialogOpen(false),
        onError: (err) => {
          const fe = extractFieldErrors(err)
          if (fe) setFieldErrors(fe)
        },
      })
    }
  }

  if (isLoading) return <PageSkeleton />

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Alat"
        description="Daftar peralatan yang tersedia."
        actions={
          isAdmin ? (
            <Button
              onClick={() => {
                setEditing(null)
                setFieldErrors({})
                setDialogOpen(true)
              }}
            >
              Tambah Alat
            </Button>
          ) : undefined
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={params.kategori_id ?? "all"}
          onValueChange={(v) =>
            setParams((p) => ({
              ...p,
              kategori_id: v === "all" ? undefined : v,
              page: 1,
            }))
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Semua Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Semua Kategori</SelectItem>
              {kategorisData?.data.map((k) => (
                <SelectItem key={k.id} value={k.id}>
                  {k.nama_kategori}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          value={params.kondisi ?? "all"}
          onValueChange={(v) =>
            setParams((p) => ({
              ...p,
              kondisi:
                v === "all" ? undefined : (v as AlatListParams["kondisi"]),
              page: 1,
            }))
          }
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Semua Kondisi" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Semua Kondisi</SelectItem>
              <SelectItem value="baik">Baik</SelectItem>
              <SelectItem value="rusak">Rusak</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Alat</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead className="text-center">Stok</TableHead>
              <TableHead className="text-center">Tersedia</TableHead>
              <TableHead>Kondisi</TableHead>
              {isAdmin && <TableHead className="w-[100px]">Aksi</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data.map((alat) => (
              <TableRow key={alat.id}>
                <TableCell className="font-medium">{alat.nama_alat}</TableCell>
                <TableCell className="text-muted-foreground">
                  {alat.kategori?.nama_kategori}
                </TableCell>
                <TableCell className="text-center">{alat.stok}</TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={
                      alat.stok_tersedia > 0 ? "secondary" : "destructive"
                    }
                  >
                    {alat.stok_tersedia}
                  </Badge>
                </TableCell>
                <TableCell>
                  <KondisiBadge kondisi={alat.kondisi} />
                </TableCell>
                {isAdmin && (
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditing(alat)
                          setFieldErrors({})
                          setDialogOpen(true)
                        }}
                      >
                        Edit
                      </Button>
                      <ConfirmDialog
                        title="Hapus Alat"
                        description={`Yakin ingin menghapus "${alat.nama_alat}"?`}
                        trigger={
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                          >
                            Hapus
                          </Button>
                        }
                        onConfirm={() => deleteAlat.mutateAsync(alat.id)}
                      />
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
            {data?.data.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={isAdmin ? 6 : 5}
                  className="h-24 text-center text-muted-foreground"
                >
                  Belum ada alat.
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Alat" : "Tambah Alat"}</DialogTitle>
            <DialogDescription>
              {editing ? "Ubah data alat." : "Tambah alat baru."}
            </DialogDescription>
          </DialogHeader>
          <AlatForm
            alat={editing}
            fieldErrors={fieldErrors}
            isSubmitting={createAlat.isPending || updateAlat.isPending}
            onSubmit={handleSubmit}
            onCancel={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
