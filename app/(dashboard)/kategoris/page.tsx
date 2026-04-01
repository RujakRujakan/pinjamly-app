"use client"

import type { FieldErrors } from "@/lib/types/api"
import type {
  CreateKategoriRequest,
  Kategori,
  UpdateKategoriRequest,
} from "@/lib/types/kategori"

import { useState } from "react"
import { KategoriForm } from "@/components/forms/kategori-form"
import { PageHeader } from "@/components/layout/page-header"
import { RoleGuard, useHasRole } from "@/components/role-guard"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { PageSkeleton } from "@/components/shared/loading-skeleton"
import { PaginationControls } from "@/components/shared/pagination-controls"
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
  useCreateKategori,
  useDeleteKategori,
  useKategoris,
  useUpdateKategori,
} from "@/hooks/use-kategoris"

export default function KategorisPage() {
  return (
    <RoleGuard allowedRoles={["admin", "petugas"]}>
      <KategorisContent />
    </RoleGuard>
  )
}

function KategorisContent() {
  const isAdmin = useHasRole("admin")
  const [page, setPage] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Kategori | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  const { data, isLoading } = useKategoris(page)
  const createKategori = useCreateKategori()
  const updateKategori = useUpdateKategori()
  const deleteKategori = useDeleteKategori()

  function handleSubmit(
    formData: CreateKategoriRequest | UpdateKategoriRequest
  ) {
    setFieldErrors({})
    if (editing) {
      updateKategori.mutate(
        { id: editing.id, data: formData },
        {
          onSuccess: () => setDialogOpen(false),
          onError: (err) => {
            const fe = extractFieldErrors(err)
            if (fe) setFieldErrors(fe)
          },
        }
      )
    } else {
      createKategori.mutate(formData as CreateKategoriRequest, {
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
        title="Kategori"
        description="Kelola kategori peralatan."
        actions={
          isAdmin ? (
            <Button
              onClick={() => {
                setEditing(null)
                setFieldErrors({})
                setDialogOpen(true)
              }}
            >
              Tambah Kategori
            </Button>
          ) : undefined
        }
      />

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Kategori</TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead className="text-center">Jumlah Alat</TableHead>
              {isAdmin && <TableHead className="w-[100px]">Aksi</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data.map((kat) => (
              <TableRow key={kat.id}>
                <TableCell className="font-medium">
                  {kat.nama_kategori}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {kat.deskripsi || "—"}
                </TableCell>
                <TableCell className="text-center">{kat.alats_count}</TableCell>
                {isAdmin && (
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditing(kat)
                          setFieldErrors({})
                          setDialogOpen(true)
                        }}
                      >
                        Edit
                      </Button>
                      <ConfirmDialog
                        title="Hapus Kategori"
                        description={`Yakin ingin menghapus "${kat.nama_kategori}"? Kategori dengan alat tidak dapat dihapus.`}
                        trigger={
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                          >
                            Hapus
                          </Button>
                        }
                        onConfirm={() => deleteKategori.mutateAsync(kat.id)}
                      />
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
            {data?.data.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={isAdmin ? 4 : 3}
                  className="h-24 text-center text-muted-foreground"
                >
                  Belum ada kategori.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {data?.meta && (
        <PaginationControls meta={data.meta} onPageChange={setPage} />
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Kategori" : "Tambah Kategori"}
            </DialogTitle>
            <DialogDescription>
              {editing ? "Ubah data kategori." : "Buat kategori baru."}
            </DialogDescription>
          </DialogHeader>
          <KategoriForm
            kategori={editing}
            fieldErrors={fieldErrors}
            isSubmitting={createKategori.isPending || updateKategori.isPending}
            onSubmit={handleSubmit}
            onCancel={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
