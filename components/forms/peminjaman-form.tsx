"use client"

import type { FieldErrors } from "@/lib/types/api"
import type { CreatePeminjamanRequest } from "@/lib/types/peminjaman"

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
import { useAlats } from "@/hooks/use-alats"

interface PeminjamanFormProps {
  fieldErrors: FieldErrors
  isSubmitting: boolean
  onSubmit: (data: CreatePeminjamanRequest) => void
  onCancel: () => void
}

export function PeminjamanForm({
  fieldErrors,
  isSubmitting,
  onSubmit,
  onCancel,
}: PeminjamanFormProps) {
  const [alatId, setAlatId] = useState("")
  const [jumlah, setJumlah] = useState("1")
  const [tanggalPinjam, setTanggalPinjam] = useState("")
  const [tanggalKembali, setTanggalKembali] = useState("")
  const [tujuan, setTujuan] = useState("")

  const { data: alatsData } = useAlats({ tersedia: true })

  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault()
    onSubmit({
      alat_id: alatId,
      jumlah: parseInt(jumlah, 10),
      tanggal_pinjam: tanggalPinjam,
      tanggal_kembali_rencana: tanggalKembali,
      tujuan,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label className={fieldErrors.alat_id ? "text-destructive" : ""}>
          Alat
        </Label>
        <Select value={alatId} onValueChange={setAlatId}>
          <SelectTrigger aria-invalid={!!fieldErrors.alat_id}>
            <SelectValue placeholder="Pilih alat" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {alatsData?.data.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.nama_alat} (tersedia: {a.stok_tersedia})
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {fieldErrors.alat_id && (
          <p className="text-xs text-destructive">{fieldErrors.alat_id[0]}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label
          htmlFor="pjm-jumlah"
          className={fieldErrors.jumlah ? "text-destructive" : ""}
        >
          Jumlah
        </Label>
        <Input
          id="pjm-jumlah"
          type="number"
          min="1"
          value={jumlah}
          onChange={(e) => setJumlah(e.target.value)}
          aria-invalid={!!fieldErrors.jumlah}
          required
        />
        {fieldErrors.jumlah && (
          <p className="text-xs text-destructive">{fieldErrors.jumlah[0]}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="pjm-tgl-pinjam"
            className={fieldErrors.tanggal_pinjam ? "text-destructive" : ""}
          >
            Tanggal Pinjam
          </Label>
          <Input
            id="pjm-tgl-pinjam"
            type="date"
            value={tanggalPinjam}
            onChange={(e) => setTanggalPinjam(e.target.value)}
            aria-invalid={!!fieldErrors.tanggal_pinjam}
            required
          />
          {fieldErrors.tanggal_pinjam && (
            <p className="text-xs text-destructive">
              {fieldErrors.tanggal_pinjam[0]}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="pjm-tgl-kembali"
            className={
              fieldErrors.tanggal_kembali_rencana ? "text-destructive" : ""
            }
          >
            Tanggal Kembali
          </Label>
          <Input
            id="pjm-tgl-kembali"
            type="date"
            value={tanggalKembali}
            onChange={(e) => setTanggalKembali(e.target.value)}
            aria-invalid={!!fieldErrors.tanggal_kembali_rencana}
            required
          />
          {fieldErrors.tanggal_kembali_rencana && (
            <p className="text-xs text-destructive">
              {fieldErrors.tanggal_kembali_rencana[0]}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label
          htmlFor="pjm-tujuan"
          className={fieldErrors.tujuan ? "text-destructive" : ""}
        >
          Tujuan Peminjaman
        </Label>
        <Textarea
          id="pjm-tujuan"
          value={tujuan}
          onChange={(e) => setTujuan(e.target.value)}
          rows={3}
          aria-invalid={!!fieldErrors.tujuan}
          required
        />
        {fieldErrors.tujuan && (
          <p className="text-xs text-destructive">{fieldErrors.tujuan[0]}</p>
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
          {isSubmitting ? "Mengajukan..." : "Ajukan Peminjaman"}
        </Button>
      </div>
    </form>
  )
}
