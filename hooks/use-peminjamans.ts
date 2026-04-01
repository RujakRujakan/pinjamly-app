"use client"

import type {
  ApproveRejectRequest,
  CreatePeminjamanRequest,
  PeminjamanListParams,
  UpdatePeminjamanRequest,
} from "@/lib/types/peminjaman"

import { peminjamansApi } from "@/lib/api/peminjamans"
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { extractErrorMessage } from "./use-auth"

export const peminjamanKeys = {
  all: ["peminjamans"] as const,
  lists: () => [...peminjamanKeys.all, "list"] as const,
  list: (params?: PeminjamanListParams) =>
    [...peminjamanKeys.lists(), params] as const,
  details: () => [...peminjamanKeys.all, "detail"] as const,
  detail: (id: string) => [...peminjamanKeys.details(), id] as const,
}

export function usePeminjamans(params?: PeminjamanListParams) {
  return useQuery({
    queryKey: peminjamanKeys.list(params),
    queryFn: () => peminjamansApi.getAll(params),
    placeholderData: keepPreviousData,
  })
}

export function usePeminjaman(id: string) {
  return useQuery({
    queryKey: peminjamanKeys.detail(id),
    queryFn: () => peminjamansApi.getOne(id),
    enabled: !!id,
  })
}

export function useCreatePeminjaman() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreatePeminjamanRequest) => peminjamansApi.create(data),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: peminjamanKeys.lists() })
      toast.success(res.message)
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  })
}

export function useUpdatePeminjaman() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePeminjamanRequest }) =>
      peminjamansApi.update(id, data),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: peminjamanKeys.all })
      toast.success(res.message)
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  })
}

export function useDeletePeminjaman() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => peminjamansApi.delete(id),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: peminjamanKeys.lists() })
      toast.success(res.message)
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  })
}

export function useApprovePeminjaman() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data?: ApproveRejectRequest }) =>
      peminjamansApi.approve(id, data),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: peminjamanKeys.all })
      toast.success(res.message)
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  })
}

export function useRejectPeminjaman() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data?: ApproveRejectRequest }) =>
      peminjamansApi.reject(id, data),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: peminjamanKeys.all })
      toast.success(res.message)
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  })
}
