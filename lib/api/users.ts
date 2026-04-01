import type {
  MessageResponse,
  MutationResponse,
  PaginatedResponse,
  SingleResponse,
} from "@/lib/types/api"
import type {
  CreateUserRequest,
  UpdateUserRequest,
  User,
} from "@/lib/types/user"

import api from "@/lib/axios"

export const usersApi = {
  getAll: (page = 1) =>
    api
      .get<PaginatedResponse<User>>("/users", { params: { page } })
      .then((r) => r.data),

  getOne: (id: string) =>
    api.get<SingleResponse<User>>(`/users/${id}`).then((r) => r.data),

  create: (data: CreateUserRequest) =>
    api.post<MutationResponse<User>>("/users", data).then((r) => r.data),

  update: (id: string, data: UpdateUserRequest) =>
    api.put<MutationResponse<User>>(`/users/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    api.delete<MessageResponse>(`/users/${id}`).then((r) => r.data),
}
