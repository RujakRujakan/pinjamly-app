import type {
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  MeResponse,
} from "@/lib/types/auth"

import api from "@/lib/axios"

export const authApi = {
  login: (data: LoginRequest) =>
    api.post<LoginResponse>("/auth/login", data).then((r) => r.data),

  logout: () => api.post<LogoutResponse>("/auth/logout").then((r) => r.data),

  getMe: () => api.get<MeResponse>("/auth/me").then((r) => r.data),
}
