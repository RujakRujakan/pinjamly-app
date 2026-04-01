import type { Peminjaman } from "./peminjaman"
import type { Pengembalian } from "./pengembalian"

export interface LaporanDateParams {
  dari?: string
  sampai?: string
  page?: number
}

export interface LaporanPeminjamanParams extends LaporanDateParams {
  status?: string
}

export interface LaporanPeminjamanResponse {
  data: Peminjaman[]
  summary: {
    total: number
  }
}

export interface LaporanPengembalianResponse {
  data: Pengembalian[]
  summary: {
    total: number
    total_denda: number
  }
}

export interface LaporanDendaResponse {
  data: Pengembalian[]
  summary: {
    total_transaksi_denda: number
    total_denda: number
  }
}
