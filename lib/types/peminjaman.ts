export type PeminjamanStatus =
  | "menunggu"
  | "disetujui"
  | "ditolak"
  | "dipinjam"
  | "dikembalikan"

export interface PeminjamanAlat {
  id: string
  nama_alat: string
  stok_tersedia?: number
}

export interface PeminjamanPeminjam {
  id: string
  name: string
  role?: string
}

export interface PeminjamanPetugas {
  id: string
  name: string
}

export interface Peminjaman {
  id: string
  kode_peminjaman: string
  jumlah: number
  tanggal_pinjam: string
  tanggal_kembali_rencana: string
  tanggal_kembali_aktual: string | null
  status: PeminjamanStatus
  tujuan: string
  catatan_petugas: string | null
  peminjam: PeminjamanPeminjam
  petugas: PeminjamanPetugas | null
  alat: PeminjamanAlat
  pengembalian?: unknown | null
}

export interface PeminjamanListParams {
  status?: PeminjamanStatus
  page?: number
}

export interface CreatePeminjamanRequest {
  alat_id: string
  jumlah: number
  tanggal_pinjam: string
  tanggal_kembali_rencana: string
  tujuan: string
}

export interface UpdatePeminjamanRequest {
  alat_id?: string
  jumlah?: number
  tanggal_pinjam?: string
  tanggal_kembali_rencana?: string
  tujuan?: string
  catatan_petugas?: string | null
  status?: PeminjamanStatus
}

export interface ApproveRejectRequest {
  catatan_petugas?: string
}
