"use client"

import type {
  Alat,
  CreateAlatRequest,
  KondisiAlat,
  UpdateAlatRequest,
} from "@/lib/types/alat"
import type { FieldErrors } from "@/lib/types/api"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { useKategoris } from "@/hooks/use-kategoris"

interface AlatFormProps {
  alat?: Alat | null
  fieldErrors: FieldErrors
  isSubmitting: boolean
  onSubmit: (data: CreateAlatRequest | UpdateAlatRequest) => void
  onCancel: () => void
}

export function AlatForm({
  alat,
  fieldErrors,
  isSubmitting,
  onSubmit,
  onCancel,
}: AlatFormProps) {
  const [namaAlat, setNamaAlat] = useState(alat?.nama_alat ?? "")
  const [deskripsi, setDeskripsi] = useState(alat?.deskripsi ?? "")
  const [kategoriId, setKategoriId] = useState(alat?.kategori?.id ?? "")
  const [stok, setStok] = useState(String(alat?.stok ?? ""))
  const [kondisi, setKondisi] = useState<KondisiAlat>(alat?.kondisi ?? "baik")
  const [foto, setFoto] = useState<File | undefined>(undefined)

  const { data: kategorisData } = useKategoris(1)

  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault()
    const data: CreateAlatRequest | UpdateAlatRequest = {
      nama_alat: namaAlat,
      deskripsi: deskripsi || null,
      kategori_id: kategoriId,
      stok: parseInt(stok, 10),
      kondisi,
    }
    if (foto) (data as CreateAlatRequest).foto = foto
    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label
          htmlFor="alat-nama"
          className={fieldErrors.nama_alat ? "text-destructive" : ""}
        >
          Nama Alat
        </Label>
        <Input
          id="alat-nama"
          value={namaAlat}
          onChange={(e) => setNamaAlat(e.target.value)}
          aria-invalid={!!fieldErrors.nama_alat}
          required
        />
        {fieldErrors.nama_alat && (
          <p className="text-xs text-destructive">{fieldErrors.nama_alat[0]}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label className={fieldErrors.kategori_id ? "text-destructive" : ""}>
          Kategori
        </Label>
        <Select value={kategoriId} onValueChange={setKategoriId}>
          <SelectTrigger aria-invalid={!!fieldErrors.kategori_id}>
            <SelectValue placeholder="Pilih kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {kategorisData?.data.map((k) => (
                <SelectItem key={k.id} value={k.id}>
                  {k.nama_kategori}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {fieldErrors.kategori_id && (
          <p className="text-xs text-destructive">
            {fieldErrors.kategori_id[0]}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="alat-stok"
            className={fieldErrors.stok ? "text-destructive" : ""}
          >
            Stok
          </Label>
          <Input
            id="alat-stok"
            type="number"
            min="1"
            value={stok}
            onChange={(e) => setStok(e.target.value)}
            aria-invalid={!!fieldErrors.stok}
            required
          />
          {fieldErrors.stok && (
            <p className="text-xs text-destructive">{fieldErrors.stok[0]}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label className={fieldErrors.kondisi ? "text-destructive" : ""}>
            Kondisi
          </Label>
          <Select
            value={kondisi}
            onValueChange={(v) => setKondisi(v as KondisiAlat)}
          >
            <SelectTrigger aria-invalid={!!fieldErrors.kondisi}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="baik">Baik</SelectItem>
                <SelectItem value="rusak">Rusak</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {fieldErrors.kondisi && (
            <p className="text-xs text-destructive">{fieldErrors.kondisi[0]}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="alat-desk">Deskripsi</Label>
        <Textarea
          id="alat-desk"
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
          rows={3}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="alat-foto">
          Foto{" "}
          {alat && (
            <span className="text-xs text-muted-foreground">
              (kosongkan jika tidak diubah)
            </span>
          )}
        </Label>
        <Input
          id="alat-foto"
          type="file"
          accept="image/*"
          onChange={(e) => setFoto(e.target.files?.[0])}
        />
        {fieldErrors.foto && (
          <p className="text-xs text-destructive">{fieldErrors.foto[0]}</p>
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
