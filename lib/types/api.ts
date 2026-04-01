export interface PaginationLinks {
  first: string | null
  last: string | null
  prev: string | null
  next: string | null
}

export interface PaginationMeta {
  current_page: number
  from: number | null
  last_page: number
  per_page: number
  to: number | null
  total: number
}

export interface PaginatedResponse<T> {
  data: T[]
  links: PaginationLinks
  meta: PaginationMeta
}

export interface SingleResponse<T> {
  data: T
}

export interface MessageResponse {
  message: string
}

export interface MutationResponse<T> {
  message: string
  data: T
}

export interface ValidationErrorResponse {
  message: string
  errors: Record<string, string[]>
}

export type FieldErrors = Record<string, string[]>
