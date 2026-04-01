"use client"

import type {
  LaporanDateParams,
  LaporanPeminjamanParams,
} from "@/lib/types/laporan"

import { laporanApi } from "@/lib/api/laporan"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

export const laporanKeys = {
  all: ["laporan"] as const,
  peminjaman: (params?: LaporanPeminjamanParams) =>
    [...laporanKeys.all, "peminjaman", params] as const,
  pengembalian: (params?: LaporanDateParams) =>
    [...laporanKeys.all, "pengembalian", params] as const,
  denda: (params?: LaporanDateParams) =>
    [...laporanKeys.all, "denda", params] as const,
}

export function useLaporanPeminjaman(params?: LaporanPeminjamanParams) {
  return useQuery({
    queryKey: laporanKeys.peminjaman(params),
    queryFn: () => laporanApi.peminjaman(params),
    placeholderData: keepPreviousData,
  })
}

export function useLaporanPengembalian(params?: LaporanDateParams) {
  return useQuery({
    queryKey: laporanKeys.pengembalian(params),
    queryFn: () => laporanApi.pengembalian(params),
    placeholderData: keepPreviousData,
  })
}

export function useLaporanDenda(params?: LaporanDateParams) {
  return useQuery({
    queryKey: laporanKeys.denda(params),
    queryFn: () => laporanApi.denda(params),
    placeholderData: keepPreviousData,
  })
}
