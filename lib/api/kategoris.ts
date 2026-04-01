import type {
  MessageResponse,
  MutationResponse,
  PaginatedResponse,
  SingleResponse,
} from "@/lib/types/api"
import type {
  CreateKategoriRequest,
  Kategori,
  UpdateKategoriRequest,
} from "@/lib/types/kategori"

import api from "@/lib/axios"

export const kategorisApi = {
  getAll: (page = 1) =>
    api
      .get<PaginatedResponse<Kategori>>("/kategoris", { params: { page } })
      .then((r) => r.data),

  getOne: (id: string) =>
    api.get<SingleResponse<Kategori>>(`/kategoris/${id}`).then((r) => r.data),

  create: (data: CreateKategoriRequest) =>
    api
      .post<MutationResponse<Kategori>>("/kategoris", data)
      .then((r) => r.data),

  update: (id: string, data: UpdateKategoriRequest) =>
    api
      .put<MutationResponse<Kategori>>(`/kategoris/${id}`, data)
      .then((r) => r.data),

  delete: (id: string) =>
    api.delete<MessageResponse>(`/kategoris/${id}`).then((r) => r.data),
}
