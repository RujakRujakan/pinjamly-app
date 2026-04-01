"use client"

import {
  ArrowTurnBackwardIcon,
  CheckListIcon,
  Wrench01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { PageHeader } from "@/components/layout/page-header"
import { useHasRole } from "@/components/role-guard"
import { CardSkeleton } from "@/components/shared/loading-skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAlats } from "@/hooks/use-alats"
import { usePeminjamans } from "@/hooks/use-peminjamans"
import { usePengembalians } from "@/hooks/use-pengembalians"
import { useAuthStore } from "@/stores/auth-store"

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const isAdminOrPetugas = useHasRole("admin", "petugas")

  const { data: alatsData, isLoading: alatsLoading } = useAlats({ page: 1 })
  const { data: peminjamanData, isLoading: peminjamanLoading } = usePeminjamans(
    { page: 1 }
  )
  const { data: pengembalianData, isLoading: pengembalianLoading } =
    usePengembalians(1)

  const stats = [
    {
      title: "Total Alat",
      value: alatsData?.meta.total ?? "—",
      icon: Wrench01Icon,
      show: true,
    },
    {
      title: "Total Peminjaman",
      value: peminjamanData?.meta.total ?? "—",
      icon: CheckListIcon,
      show: true,
    },
    {
      title: "Total Pengembalian",
      value: pengembalianData?.meta.total ?? "—",
      icon: ArrowTurnBackwardIcon,
      show: isAdminOrPetugas,
    },
  ]

  const isLoading = alatsLoading || peminjamanLoading || pengembalianLoading

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`Selamat datang, ${user?.name ?? "Pengguna"}!`}
        description="Ringkasan data sistem peminjaman alat."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)
          : stats
              .filter((s) => s.show)
              .map((stat) => (
                <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <HugeiconsIcon icon={stat.icon} className="size-6 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <p className="font-heading text-3xl font-bold">
                      {stat.value}
                    </p>
                  </CardContent>
                </Card>
              ))}
      </div>

      {peminjamanData && peminjamanData.data.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Peminjaman Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {peminjamanData.data.slice(0, 5).map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-lg border p-3 text-sm"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium">{p.kode_peminjaman}</span>
                    <span className="text-xs text-muted-foreground">
                      {p.alat.nama_alat} — {p.peminjam.name}
                    </span>
                  </div>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs capitalize">
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
