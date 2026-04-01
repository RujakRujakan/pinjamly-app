export interface LogAktifitasUser {
  id: string
  name: string
  role: string
}

export interface LogAktifitas {
  id: string
  aksi: string
  model_type: string | null
  model_id: string | null
  deskripsi: string
  ip_address: string
  user: LogAktifitasUser
  created_at: string
}

export interface LogAktifitasListParams {
  user_id?: string
  aksi?: string
  page?: number
}
