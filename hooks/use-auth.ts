"use client"

import type { FieldErrors, ValidationErrorResponse } from "@/lib/types/api"
import type { LoginRequest } from "@/lib/types/auth"

import { useRouter } from "next/navigation"
import { authApi } from "@/lib/api/auth"
import { useAuthStore } from "@/stores/auth-store"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { isAxiosError } from "axios"
import { toast } from "sonner"

export function useLogin() {
  const { setAuth } = useAuthStore()
  const router = useRouter()

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (res) => {
      setAuth(res.access_token, res.user)
      toast.success(res.message)
      router.push("/dashboard")
    },
  })
}

export function useLogout() {
  const { clearAuth } = useAuthStore()
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: (res) => {
      clearAuth()
      queryClient.clear()
      toast.success(res.message)
      router.push("/login")
    },
    onError: () => {
      clearAuth()
      queryClient.clear()
      router.push("/login")
    },
  })
}

export function extractFieldErrors(error: unknown): FieldErrors | null {
  if (
    isAxiosError<ValidationErrorResponse>(error) &&
    error.response?.status === 422
  ) {
    return error.response.data.errors ?? null
  }
  return null
}

export function extractErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    return error.response?.data?.message || error.message
  }
  if (error instanceof Error) return error.message
  return "Terjadi kesalahan."
}
