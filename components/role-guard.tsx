"use client"

import type { UserRole } from "@/lib/types/user"
import type { ReactNode } from "react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAuthStore } from "@/stores/auth-store"

interface RoleGuardProps {
  children: ReactNode
  allowedRoles: UserRole[]
  fallback?: ReactNode
}

export function RoleGuard({
  children,
  allowedRoles,
  fallback,
}: RoleGuardProps) {
  const user = useAuthStore((s) => s.user)

  if (!user || !allowedRoles.includes(user.role)) {
    if (fallback) return <>{fallback}</>
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-8">
        <Alert variant="destructive" className="max-w-md">
          <AlertTitle>Akses Ditolak</AlertTitle>
          <AlertDescription>
            Anda tidak memiliki izin untuk mengakses halaman ini.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return <>{children}</>
}

export function useHasRole(...roles: UserRole[]): boolean {
  const user = useAuthStore((s) => s.user)
  return !!user && roles.includes(user.role)
}
