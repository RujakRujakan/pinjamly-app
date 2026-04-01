"use client"

import type { User, UserRole } from "@/lib/types/user"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  setAuth: (token: string, user: User) => void
  updateUser: (user: User) => void
  clearAuth: () => void
  getRole: () => UserRole | null
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setAuth: (token, user) => set({ token, user, isAuthenticated: true }),
      updateUser: (user) => set({ user }),
      clearAuth: () => set({ token: null, user: null, isAuthenticated: false }),
      getRole: () => get().user?.role ?? null,
    }),
    {
      name: "pinjamly-auth",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
