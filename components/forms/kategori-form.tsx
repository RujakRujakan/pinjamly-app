"use client"

import type { FieldErrors } from "@/lib/types/api"
import type {
  CreateKategoriRequest,
  Kategori,
  UpdateKategoriRequest,
} from "@/lib/types/kategori"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"

interface KategoriFormProps {
  kategori?: Kategori | null
  fieldErrors: FieldErrors
  isSubmitting: boolean
  onSubmit: (data: CreateKategoriRequest | UpdateKategoriRequest) => void
  onCancel: () => void
}

export function KategoriForm({
  kategori,
  fieldErrors,
  isSubmitting,
  onSubmit,
  onCancel,
}: KategoriFormProps) {
  const [namaKategori, setNamaKategori] = useState(
    kategori?.nama_kategori ?? ""
  )
  const [deskripsi, setDeskripsi] = useState(kategori?.deskripsi ?? "")

  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault()
    onSubmit({ nama_kategori: namaKategori, deskripsi: deskripsi || null })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label
          htmlFor="kat-nama"
          className={fieldErrors.nama_kategori ? "text-destructive" : ""}
        >
          Nama Kategori
        </Label>
        <Input
          id="kat-nama"
          value={namaKategori}
          onChange={(e) => setNamaKategori(e.target.value)}
          aria-invalid={!!fieldErrors.nama_kategori}
          required
        />
        {fieldErrors.nama_kategori && (
          <p className="text-xs text-destructive">
            {fieldErrors.nama_kategori[0]}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="kat-desk">Deskripsi</Label>
        <Textarea
          id="kat-desk"
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
          rows={3}
        />
        {fieldErrors.deskripsi && (
          <p className="text-xs text-destructive">{fieldErrors.deskripsi[0]}</p>
        )}
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Batal
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Spinner data-icon="inline-start" />}
          {isSubmitting ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>
    </form>
  )
}
