export interface Kategori {
  id: string
  nama_kategori: string
  deskripsi: string | null
  alats_count: number
  created_at: string
  updated_at: string
}

export interface CreateKategoriRequest {
  nama_kategori: string
  deskripsi?: string | null
}

export interface UpdateKategoriRequest {
  nama_kategori?: string
  deskripsi?: string | null
}
