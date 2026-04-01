import type { PeminjamanStatus } from "@/lib/types/peminjaman"

import { Badge } from "@/components/ui/badge"

const statusConfig: Record<
  PeminjamanStatus,
  {
    label: string
    variant: "default" | "secondary" | "destructive" | "outline"
  }
> = {
  menunggu: { label: "Menunggu", variant: "outline" },
  disetujui: { label: "Disetujui", variant: "secondary" },
  dipinjam: { label: "Dipinjam", variant: "default" },
  ditolak: { label: "Ditolak", variant: "destructive" },
  dikembalikan: { label: "Dikembalikan", variant: "secondary" },
}

interface StatusBadgeProps {
  status: PeminjamanStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] || {
    label: status,
    variant: "outline" as const,
  }

  return (
    <Badge variant={config.variant} className="capitalize">
      {config.label}
    </Badge>
  )
}

const kondisiConfig = {
  baik: { label: "Baik", variant: "secondary" as const },
  rusak: { label: "Rusak", variant: "destructive" as const },
  maintenance: { label: "Maintenance", variant: "outline" as const },
}

export function KondisiBadge({ kondisi }: { kondisi: string }) {
  const config = kondisiConfig[kondisi as keyof typeof kondisiConfig] || {
    label: kondisi,
    variant: "outline" as const,
  }
  return <Badge variant={config.variant}>{config.label}</Badge>
}
