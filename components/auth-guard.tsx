"use client"

import type { ReactNode } from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/auth-store"

export function AuthGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated, token } = useAuthStore()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setTimeout(() => setMounted(true), 0)
  }, [])

  useEffect(() => {
    if (mounted && !isAuthenticated && !token) {
      router.replace("/login")
    }
  }, [mounted, isAuthenticated, token, router])

  if (!mounted || !isAuthenticated) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return <>{children}</>
}
