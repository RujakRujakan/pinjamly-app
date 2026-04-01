"use client"

import type {
  AlatListParams,
  CreateAlatRequest,
  UpdateAlatRequest,
} from "@/lib/types/alat"

import { alatsApi } from "@/lib/api/alats"
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { extractErrorMessage } from "./use-auth"

export const alatKeys = {
  all: ["alats"] as const,
  lists: () => [...alatKeys.all, "list"] as const,
  list: (params?: AlatListParams) => [...alatKeys.lists(), params] as const,
  details: () => [...alatKeys.all, "detail"] as const,
  detail: (id: string) => [...alatKeys.details(), id] as const,
}

export function useAlats(params?: AlatListParams) {
  return useQuery({
    queryKey: alatKeys.list(params),
    queryFn: () => alatsApi.getAll(params),
    placeholderData: keepPreviousData,
  })
}

export function useAlat(id: string) {
  return useQuery({
    queryKey: alatKeys.detail(id),
    queryFn: () => alatsApi.getOne(id),
    enabled: !!id,
  })
}

export function useCreateAlat() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateAlatRequest) => alatsApi.create(data),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: alatKeys.lists() })
      toast.success(res.message)
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  })
}

export function useUpdateAlat() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAlatRequest }) =>
      alatsApi.update(id, data),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: alatKeys.all })
      toast.success(res.message)
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  })
}

export function useDeleteAlat() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => alatsApi.delete(id),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: alatKeys.lists() })
      toast.success(res.message)
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  })
}
