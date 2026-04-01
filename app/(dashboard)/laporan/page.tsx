"use client"

import type {
  LaporanDateParams,
  LaporanPeminjamanParams,
} from "@/lib/types/laporan"

import { useState } from "react"
import { PageHeader } from "@/components/layout/page-header"
import { RoleGuard } from "@/components/role-guard"
import { KondisiBadge, StatusBadge } from "@/components/shared/status-badge"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  useLaporanDenda,
  useLaporanPeminjaman,
  useLaporanPengembalian,
} from "@/hooks/use-laporan"

function formatCurrency(val: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(val)
}

export default function LaporanPage() {
  return (
    <RoleGuard allowedRoles={["admin", "petugas"]}>
      <LaporanContent />
    </RoleGuard>
  )
}

function LaporanContent() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Laporan"
        description="Laporan peminjaman, pengembalian, dan denda."
      />

      <Tabs defaultValue="peminjaman">
        <TabsList>
          <TabsTrigger value="peminjaman">Peminjaman</TabsTrigger>
          <TabsTrigger value="pengembalian">Pengembalian</TabsTrigger>
          <TabsTrigger value="denda">Denda</TabsTrigger>
        </TabsList>

        <TabsContent value="peminjaman">
          <PeminjamanReport />
        </TabsContent>
        <TabsContent value="pengembalian">
          <PengembalianReport />
        </TabsContent>
        <TabsContent value="denda">
          <DendaReport />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function PeminjamanReport() {
  const [params, setParams] = useState<LaporanPeminjamanParams>({})
  const { data, isLoading } = useLaporanPeminjaman(params)

  return (
    <div className="flex flex-col gap-4 pt-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <Label className="text-xs">Dari</Label>
          <Input
            type="date"
            value={params.dari ?? ""}
            onChange={(e) =>
              setParams((p) => ({ ...p, dari: e.target.value || undefined }))
            }
            className="w-[160px]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-xs">Sampai</Label>
          <Input
            type="date"
            value={params.sampai ?? ""}
            onChange={(e) =>
              setParams((p) => ({ ...p, sampai: e.target.value || undefined }))
            }
            className="w-[160px]"
          />
        </div>
        <Select
          value={params.status ?? "all"}
          onValueChange={(v) =>
            setParams((p) => ({ ...p, status: v === "all" ? undefined : v }))
          }
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="menunggu">Menunggu</SelectItem>
              <SelectItem value="dipinjam">Dipinjam</SelectItem>
              <SelectItem value="ditolak">Ditolak</SelectItem>
              <SelectItem value="dikembalikan">Dikembalikan</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {data?.summary && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Total Peminjaman
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-heading text-3xl font-bold">
              {data.summary.total}
            </p>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <Skeleton className="h-40 w-full" />
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kode</TableHead>
                <TableHead>Peminjam</TableHead>
                <TableHead>Alat</TableHead>
                <TableHead>Tgl Pinjam</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs">
                    {p.kode_peminjaman}
                  </TableCell>
                  <TableCell>{p.peminjam.name}</TableCell>
                  <TableCell>{p.alat.nama_alat}</TableCell>
                  <TableCell className="text-sm">{p.tanggal_pinjam}</TableCell>
                  <TableCell>
                    <StatusBadge status={p.status} />
                  </TableCell>
                </TableRow>
              ))}
              {(!data?.data || data.data.length === 0) && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Tidak ada data.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

function PengembalianReport() {
  const [params, setParams] = useState<LaporanDateParams>({})
  const { data, isLoading } = useLaporanPengembalian(params)

  return (
    <div className="flex flex-col gap-4 pt-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <Label className="text-xs">Dari</Label>
          <Input
            type="date"
            value={params.dari ?? ""}
            onChange={(e) =>
              setParams((p) => ({ ...p, dari: e.target.value || undefined }))
            }
            className="w-[160px]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-xs">Sampai</Label>
          <Input
            type="date"
            value={params.sampai ?? ""}
            onChange={(e) =>
              setParams((p) => ({ ...p, sampai: e.target.value || undefined }))
            }
            className="w-[160px]"
          />
        </div>
      </div>

      {data?.summary && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Total Pengembalian
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-heading text-3xl font-bold">
                {data.summary.total}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Total Denda
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-heading text-3xl font-bold">
                {formatCurrency(data.summary.total_denda)}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {isLoading ? (
        <Skeleton className="h-40 w-full" />
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kode Peminjaman</TableHead>
                <TableHead>Peminjam</TableHead>
                <TableHead>Alat</TableHead>
                <TableHead>Tgl Kembali</TableHead>
                <TableHead>Kondisi</TableHead>
                <TableHead className="text-right">Denda</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data.map((pg) => (
                <TableRow key={pg.id}>
                  <TableCell className="font-mono text-xs">
                    {pg.peminjaman.kode_peminjaman}
                  </TableCell>
                  <TableCell>{pg.peminjaman.peminjam.name}</TableCell>
                  <TableCell>{pg.peminjaman.alat.nama_alat}</TableCell>
                  <TableCell className="text-sm">
                    {pg.tanggal_kembali}
                  </TableCell>
                  <TableCell>
                    <KondisiBadge kondisi={pg.kondisi_alat} />
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(parseFloat(pg.denda))}
                  </TableCell>
                </TableRow>
              ))}
              {(!data?.data || data.data.length === 0) && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Tidak ada data.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

function DendaReport() {
  const [params, setParams] = useState<LaporanDateParams>({})
  const { data, isLoading } = useLaporanDenda(params)

  return (
    <div className="flex flex-col gap-4 pt-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <Label className="text-xs">Dari</Label>
          <Input
            type="date"
            value={params.dari ?? ""}
            onChange={(e) =>
              setParams((p) => ({ ...p, dari: e.target.value || undefined }))
            }
            className="w-[160px]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-xs">Sampai</Label>
          <Input
            type="date"
            value={params.sampai ?? ""}
            onChange={(e) =>
              setParams((p) => ({ ...p, sampai: e.target.value || undefined }))
            }
            className="w-[160px]"
          />
        </div>
      </div>

      {data?.summary && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Transaksi Denda
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-heading text-3xl font-bold">
                {data.summary.total_transaksi_denda}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Total Denda
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-heading text-3xl font-bold text-destructive">
                {formatCurrency(data.summary.total_denda)}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {isLoading ? (
        <Skeleton className="h-40 w-full" />
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kode Peminjaman</TableHead>
                <TableHead>Peminjam</TableHead>
                <TableHead>Alat</TableHead>
                <TableHead>Tgl Kembali</TableHead>
                <TableHead>Keterangan</TableHead>
                <TableHead className="text-right">Denda</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data.map((pg) => (
                <TableRow key={pg.id}>
                  <TableCell className="font-mono text-xs">
                    {pg.peminjaman.kode_peminjaman}
                  </TableCell>
                  <TableCell>{pg.peminjaman.peminjam.name}</TableCell>
                  <TableCell>{pg.peminjaman.alat.nama_alat}</TableCell>
                  <TableCell className="text-sm">
                    {pg.tanggal_kembali}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                    {pg.keterangan ?? "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="destructive">
                      {formatCurrency(parseFloat(pg.denda))}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {(!data?.data || data.data.length === 0) && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Tidak ada data denda.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
