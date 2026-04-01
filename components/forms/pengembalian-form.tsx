"use client"

import type { FieldErrors } from "@/lib/types/api"
import type { CreatePengembalianRequest } from "@/lib/types/pengembalian"

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
import { usePeminjamans } from "@/hooks/use-peminjamans"

interface PengembalianFormProps {
  fieldErrors: FieldErrors
  isSubmitting: boolean
  onSubmit: (data: CreatePengembalianRequest) => void
  onCancel: () => void
}

export function PengembalianForm({
  fieldErrors,
  isSubmitting,
  onSubmit,
  onCancel,
}: PengembalianFormProps) {
  const [peminjamanId, setPeminjamanId] = useState("")
  const [tanggalKembali, setTanggalKembali] = useState("")
  const [kondisiAlat, setKondisiAlat] = useState<"baik" | "rusak">("baik")
  const [keterangan, setKeterangan] = useState("")

  const { data: peminjamanData } = usePeminjamans({ status: "dipinjam" })

  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault()
    onSubmit({
      peminjaman_id: peminjamanId,
      tanggal_kembali: tanggalKembali,
      kondisi_alat: kondisiAlat,
      keterangan: keterangan || null,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label className={fieldErrors.peminjaman_id ? "text-destructive" : ""}>
          Peminjaman
        </Label>
        <Select value={peminjamanId} onValueChange={setPeminjamanId}>
          <SelectTrigger aria-invalid={!!fieldErrors.peminjaman_id}>
            <SelectValue placeholder="Pilih peminjaman" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {peminjamanData?.data.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.kode_peminjaman} — {p.alat.nama_alat}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {fieldErrors.peminjaman_id && (
          <p className="text-xs text-destructive">
            {fieldErrors.peminjaman_id[0]}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="pgb-tgl"
            className={fieldErrors.tanggal_kembali ? "text-destructive" : ""}
          >
            Tanggal Kembali
          </Label>
          <Input
            id="pgb-tgl"
            type="date"
            value={tanggalKembali}
            onChange={(e) => setTanggalKembali(e.target.value)}
            aria-invalid={!!fieldErrors.tanggal_kembali}
            required
          />
          {fieldErrors.tanggal_kembali && (
            <p className="text-xs text-destructive">
              {fieldErrors.tanggal_kembali[0]}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label className={fieldErrors.kondisi_alat ? "text-destructive" : ""}>
            Kondisi Alat
          </Label>
          <Select
            value={kondisiAlat}
            onValueChange={(v) => setKondisiAlat(v as "baik" | "rusak")}
          >
            <SelectTrigger aria-invalid={!!fieldErrors.kondisi_alat}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="baik">Baik</SelectItem>
                <SelectItem value="rusak">Rusak</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {fieldErrors.kondisi_alat && (
            <p className="text-xs text-destructive">
              {fieldErrors.kondisi_alat[0]}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="pgb-ket">
          Keterangan{" "}
          <span className="text-xs text-muted-foreground">(opsional)</span>
        </Label>
        <Textarea
          id="pgb-ket"
          value={keterangan}
          onChange={(e) => setKeterangan(e.target.value)}
          rows={3}
        />
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
          {isSubmitting ? "Memproses..." : "Proses Pengembalian"}
        </Button>
      </div>
    </form>
  )
}
