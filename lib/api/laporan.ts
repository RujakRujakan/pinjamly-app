import type {
  LaporanDateParams,
  LaporanDendaResponse,
  LaporanPeminjamanParams,
  LaporanPeminjamanResponse,
  LaporanPengembalianResponse,
} from "@/lib/types/laporan"

import api from "@/lib/axios"

export const laporanApi = {
  peminjaman: (params?: LaporanPeminjamanParams) =>
    api
      .get<LaporanPeminjamanResponse>("/laporan/peminjaman", { params })
      .then((r) => r.data),

  pengembalian: (params?: LaporanDateParams) =>
    api
      .get<LaporanPengembalianResponse>("/laporan/pengembalian", { params })
      .then((r) => r.data),

  denda: (params?: LaporanDateParams) =>
    api
      .get<LaporanDendaResponse>("/laporan/denda", { params })
      .then((r) => r.data),
}
