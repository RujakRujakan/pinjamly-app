import type {
  MessageResponse,
  MutationResponse,
  PaginatedResponse,
  SingleResponse,
} from "@/lib/types/api"
import type {
  CreatePengembalianRequest,
  Pengembalian,
  UpdatePengembalianRequest,
} from "@/lib/types/pengembalian"

import api from "@/lib/axios"

export const pengembaliansApi = {
  getAll: (page = 1) =>
    api
      .get<
        PaginatedResponse<Pengembalian>
      >("/pengembalians", { params: { page } })
      .then((r) => r.data),

  getOne: (id: string) =>
    api
      .get<SingleResponse<Pengembalian>>(`/pengembalians/${id}`)
      .then((r) => r.data),

  create: (data: CreatePengembalianRequest) =>
    api
      .post<MutationResponse<Pengembalian>>("/pengembalians", data)
      .then((r) => r.data),

  update: (id: string, data: UpdatePengembalianRequest) =>
    api
      .put<MutationResponse<Pengembalian>>(`/pengembalians/${id}`, data)
      .then((r) => r.data),

  delete: (id: string) =>
    api.delete<MessageResponse>(`/pengembalians/${id}`).then((r) => r.data),
}
