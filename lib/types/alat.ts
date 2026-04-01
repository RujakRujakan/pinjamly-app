import type { Kategori } from "./kategori"

export type KondisiAlat = "baik" | "rusak" | "maintenance"

export interface Alat {
  id: string
  nama_alat: string
  deskripsi: string | null
  stok: number
  stok_tersedia: number
  kondisi: KondisiAlat
  foto: string | null
  tersedia: boolean
  kategori: Omit<Kategori, "alats_count">
  created_at: string
  updated_at: string
}

export interface AlatListParams {
  kategori_id?: string
  kondisi?: KondisiAlat
  tersedia?: boolean
  page?: number
}

export interface CreateAlatRequest {
  kategori_id: string
  nama_alat: string
  deskripsi?: string | null
  stok: number
  kondisi: KondisiAlat
  foto?: File
}

export interface UpdateAlatRequest {
  kategori_id?: string
  nama_alat?: string
  deskripsi?: string | null
  stok?: number
  kondisi?: KondisiAlat
  foto?: File
}
