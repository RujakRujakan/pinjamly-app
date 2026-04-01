import type { User } from "./user"

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  message: string
  access_token: string
  token_type: string
  user: User
}

export interface LogoutResponse {
  message: string
}

export interface MeResponse {
  data: User
}
