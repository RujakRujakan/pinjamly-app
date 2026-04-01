"use client"

import type {
  CreateKategoriRequest,
  UpdateKategoriRequest,
} from "@/lib/types/kategori"

import { kategorisApi } from "@/lib/api/kategoris"
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { extractErrorMessage } from "./use-auth"

export const kategoriKeys = {
  all: ["kategoris"] as const,
  lists: () => [...kategoriKeys.all, "list"] as const,
  list: (page: number) => [...kategoriKeys.lists(), page] as const,
  details: () => [...kategoriKeys.all, "detail"] as const,
  detail: (id: string) => [...kategoriKeys.details(), id] as const,
}

export function useKategoris(page = 1) {
  return useQuery({
    queryKey: kategoriKeys.list(page),
    queryFn: () => kategorisApi.getAll(page),
    placeholderData: keepPreviousData,
  })
}

export function useKategori(id: string) {
  return useQuery({
    queryKey: kategoriKeys.detail(id),
    queryFn: () => kategorisApi.getOne(id),
    enabled: !!id,
  })
}

export function useCreateKategori() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateKategoriRequest) => kategorisApi.create(data),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: kategoriKeys.lists() })
      toast.success(res.message)
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  })
}

export function useUpdateKategori() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateKategoriRequest }) =>
      kategorisApi.update(id, data),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: kategoriKeys.all })
      toast.success(res.message)
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  })
}

export function useDeleteKategori() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => kategorisApi.delete(id),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: kategoriKeys.lists() })
      toast.success(res.message)
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  })
}
