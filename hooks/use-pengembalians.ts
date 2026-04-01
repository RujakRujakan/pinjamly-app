"use client"

import type {
  CreatePengembalianRequest,
  UpdatePengembalianRequest,
} from "@/lib/types/pengembalian"

import { pengembaliansApi } from "@/lib/api/pengembalians"
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { extractErrorMessage } from "./use-auth"

export const pengembalianKeys = {
  all: ["pengembalians"] as const,
  lists: () => [...pengembalianKeys.all, "list"] as const,
  list: (page: number) => [...pengembalianKeys.lists(), page] as const,
  details: () => [...pengembalianKeys.all, "detail"] as const,
  detail: (id: string) => [...pengembalianKeys.details(), id] as const,
}

export function usePengembalians(page = 1) {
  return useQuery({
    queryKey: pengembalianKeys.list(page),
    queryFn: () => pengembaliansApi.getAll(page),
    placeholderData: keepPreviousData,
  })
}

export function usePengembalian(id: string) {
  return useQuery({
    queryKey: pengembalianKeys.detail(id),
    queryFn: () => pengembaliansApi.getOne(id),
    enabled: !!id,
  })
}

export function useCreatePengembalian() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreatePengembalianRequest) =>
      pengembaliansApi.create(data),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: pengembalianKeys.lists() })
      toast.success(res.message)
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  })
}

export function useUpdatePengembalian() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: UpdatePengembalianRequest
    }) => pengembaliansApi.update(id, data),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: pengembalianKeys.all })
      toast.success(res.message)
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  })
}

export function useDeletePengembalian() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => pengembaliansApi.delete(id),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: pengembalianKeys.lists() })
      toast.success(res.message)
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  })
}
