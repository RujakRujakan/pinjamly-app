import type {
  Alat,
  AlatListParams,
  CreateAlatRequest,
  UpdateAlatRequest,
} from "@/lib/types/alat"
import type {
  MessageResponse,
  MutationResponse,
  PaginatedResponse,
  SingleResponse,
} from "@/lib/types/api"

import api from "@/lib/axios"

function buildFormData(data: CreateAlatRequest | UpdateAlatRequest): FormData {
  const fd = new FormData()
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) continue
    if (key === "foto" && value instanceof File) {
      fd.append("foto", value)
    } else {
      fd.append(key, String(value))
    }
  }
  return fd
}

export const alatsApi = {
  getAll: (params?: AlatListParams) => {
    const query: Record<string, string | number> = {}
    if (params?.page) query.page = params.page
    if (params?.kategori_id) query.kategori_id = params.kategori_id
    if (params?.kondisi) query.kondisi = params.kondisi
    if (params?.tersedia) query.tersedia = 1
    return api
      .get<PaginatedResponse<Alat>>("/alats", { params: query })
      .then((r) => r.data)
  },

  getOne: (id: string) =>
    api.get<SingleResponse<Alat>>(`/alats/${id}`).then((r) => r.data),

  create: (data: CreateAlatRequest) =>
    api
      .post<MutationResponse<Alat>>("/alats", buildFormData(data), {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data),

  update: (id: string, data: UpdateAlatRequest) =>
    api
      .post<MutationResponse<Alat>>(
        `/alats/${id}`,
        buildFormData({ ...data }),
        {
          headers: { "Content-Type": "multipart/form-data" },
          params: { _method: "PUT" },
        }
      )
      .then((r) => r.data),

  delete: (id: string) =>
    api.delete<MessageResponse>(`/alats/${id}`).then((r) => r.data),
}
