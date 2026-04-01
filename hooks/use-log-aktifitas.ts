"use client"

import type { LogAktifitasListParams } from "@/lib/types/log-aktifitas"

import { logAktifitasApi } from "@/lib/api/log-aktifitas"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

export const logKeys = {
  all: ["log-aktifitas"] as const,
  lists: () => [...logKeys.all, "list"] as const,
  list: (params?: LogAktifitasListParams) =>
    [...logKeys.lists(), params] as const,
  details: () => [...logKeys.all, "detail"] as const,
  detail: (id: string) => [...logKeys.details(), id] as const,
}

export function useLogAktifitas(params?: LogAktifitasListParams) {
  return useQuery({
    queryKey: logKeys.list(params),
    queryFn: () => logAktifitasApi.getAll(params),
    placeholderData: keepPreviousData,
  })
}

export function useLogAktifitasDetail(id: string) {
  return useQuery({
    queryKey: logKeys.detail(id),
    queryFn: () => logAktifitasApi.getOne(id),
    enabled: !!id,
  })
}
