"use client"

import type { CreateUserRequest, UpdateUserRequest } from "@/lib/types/user"

import { usersApi } from "@/lib/api/users"
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { extractErrorMessage } from "./use-auth"

export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (page: number) => [...userKeys.lists(), page] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
}

export function useUsers(page = 1) {
  return useQuery({
    queryKey: userKeys.list(page),
    queryFn: () => usersApi.getAll(page),
    placeholderData: keepPreviousData,
  })
}

export function useUser(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => usersApi.getOne(id),
    enabled: !!id,
  })
}

export function useCreateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateUserRequest) => usersApi.create(data),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: userKeys.lists() })
      toast.success(res.message)
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  })
}

export function useUpdateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) =>
      usersApi.update(id, data),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: userKeys.all })
      toast.success(res.message)
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  })
}

export function useDeleteUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => usersApi.delete(id),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: userKeys.lists() })
      toast.success(res.message)
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  })
}
