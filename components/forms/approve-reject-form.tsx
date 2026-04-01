"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"

interface ApproveRejectFormProps {
  action: "approve" | "reject"
  isSubmitting: boolean
  onSubmit: (catatan?: string) => void
  onCancel: () => void
}

export function ApproveRejectForm({
  action,
  isSubmitting,
  onSubmit,
  onCancel,
}: ApproveRejectFormProps) {
  const [catatan, setCatatan] = useState("")
  const isApprove = action === "approve"

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="ar-catatan">
          Catatan Petugas{" "}
          <span className="text-xs text-muted-foreground">(opsional)</span>
        </Label>
        <Textarea
          id="ar-catatan"
          value={catatan}
          onChange={(e) => setCatatan(e.target.value)}
          placeholder={
            isApprove
              ? "Silakan ambil alat di gudang..."
              : "Alasan penolakan..."
          }
          rows={3}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Batal
        </Button>
        <Button
          onClick={() => onSubmit(catatan || undefined)}
          disabled={isSubmitting}
          variant={isApprove ? "default" : "destructive"}
        >
          {isSubmitting && <Spinner data-icon="inline-start" />}
          {isSubmitting ? "Memproses..." : isApprove ? "Setujui" : "Tolak"}
        </Button>
      </div>
    </div>
  )
}
