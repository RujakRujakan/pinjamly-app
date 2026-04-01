import type { PaginatedResponse, SingleResponse } from "@/lib/types/api"
import type {
  LogAktifitas,
  LogAktifitasListParams,
} from "@/lib/types/log-aktifitas"

import api from "@/lib/axios"

export const logAktifitasApi = {
  getAll: (params?: LogAktifitasListParams) =>
    api
      .get<PaginatedResponse<LogAktifitas>>("/log-aktifitas", { params })
      .then((r) => r.data),

  getOne: (id: string) =>
    api
      .get<SingleResponse<LogAktifitas>>(`/log-aktifitas/${id}`)
      .then((r) => r.data),
}
