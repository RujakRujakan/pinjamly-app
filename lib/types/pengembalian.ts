export interface PengembalianPeminjaman {
  id: string
  kode_peminjaman: string
  status: string
  tanggal_kembali_rencana?: string
  tanggal_kembali_aktual?: string | null
  peminjam: { name: string }
  alat: { nama_alat: string }
}

export interface PengembalianPetugas {
  name: string
}

export interface Pengembalian {
  id: string
  tanggal_kembali: string
  kondisi_alat: "baik" | "rusak"
  denda: string
  keterangan: string | null
  peminjaman: PengembalianPeminjaman
  petugas: PengembalianPetugas
}

export interface CreatePengembalianRequest {
  peminjaman_id: string
  tanggal_kembali: string
  kondisi_alat: "baik" | "rusak"
  keterangan?: string | null
}

export interface UpdatePengembalianRequest {
  kondisi_alat?: "baik" | "rusak"
  keterangan?: string | null
}
