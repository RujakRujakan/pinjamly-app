import type {
  MessageResponse,
  MutationResponse,
  PaginatedResponse,
  SingleResponse,
} from "@/lib/types/api"
import type {
  ApproveRejectRequest,
  CreatePeminjamanRequest,
  Peminjaman,
  PeminjamanListParams,
  UpdatePeminjamanRequest,
} from "@/lib/types/peminjaman"

import api from "@/lib/axios"

export const peminjamansApi = {
  getAll: (params?: PeminjamanListParams) =>
    api
      .get<PaginatedResponse<Peminjaman>>("/peminjamans", { params })
      .then((r) => r.data),

  getOne: (id: string) =>
    api
      .get<SingleResponse<Peminjaman>>(`/peminjamans/${id}`)
      .then((r) => r.data),

  create: (data: CreatePeminjamanRequest) =>
    api
      .post<MutationResponse<Peminjaman>>("/peminjamans", data)
      .then((r) => r.data),

  update: (id: string, data: UpdatePeminjamanRequest) =>
    api
      .put<MutationResponse<Peminjaman>>(`/peminjamans/${id}`, data)
      .then((r) => r.data),

  delete: (id: string) =>
    api.delete<MessageResponse>(`/peminjamans/${id}`).then((r) => r.data),

  approve: (id: string, data?: ApproveRejectRequest) =>
    api
      .patch<MutationResponse<Peminjaman>>(`/peminjamans/${id}/approve`, data)
      .then((r) => r.data),

  reject: (id: string, data?: ApproveRejectRequest) =>
    api
      .patch<MutationResponse<Peminjaman>>(`/peminjamans/${id}/reject`, data)
      .then((r) => r.data),
}
