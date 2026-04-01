"use client"

import type { FieldErrors } from "@/lib/types/api"
import type {
  CreateUserRequest,
  UpdateUserRequest,
  User,
  UserRole,
} from "@/lib/types/user"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"

interface UserFormProps {
  user?: User | null
  fieldErrors: FieldErrors
  isSubmitting: boolean
  onSubmit: (data: CreateUserRequest | UpdateUserRequest) => void
  onCancel: () => void
}

export function UserForm({
  user,
  fieldErrors,
  isSubmitting,
  onSubmit,
  onCancel,
}: UserFormProps) {
  const [name, setName] = useState(user?.name ?? "")
  const [email, setEmail] = useState(user?.email ?? "")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<UserRole>(user?.role ?? "peminjam")

  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault()
    if (user) {
      const data: UpdateUserRequest = { name, email, role }
      if (password) data.password = password
      onSubmit(data)
    } else {
      onSubmit({ name, email, password, role })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label
          htmlFor="user-name"
          className={fieldErrors.name ? "text-destructive" : ""}
        >
          Nama
        </Label>
        <Input
          id="user-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-invalid={!!fieldErrors.name}
          required
        />
        {fieldErrors.name && (
          <p className="text-xs text-destructive">{fieldErrors.name[0]}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label
          htmlFor="user-email"
          className={fieldErrors.email ? "text-destructive" : ""}
        >
          Email
        </Label>
        <Input
          id="user-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={!!fieldErrors.email}
          required
        />
        {fieldErrors.email && (
          <p className="text-xs text-destructive">{fieldErrors.email[0]}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label
          htmlFor="user-password"
          className={fieldErrors.password ? "text-destructive" : ""}
        >
          Password{" "}
          {user && (
            <span className="text-xs text-muted-foreground">
              (kosongkan jika tidak diubah)
            </span>
          )}
        </Label>
        <Input
          id="user-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={!!fieldErrors.password}
          required={!user}
        />
        {fieldErrors.password && (
          <p className="text-xs text-destructive">{fieldErrors.password[0]}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label className={fieldErrors.role ? "text-destructive" : ""}>
          Role
        </Label>
        <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
          <SelectTrigger aria-invalid={!!fieldErrors.role}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="petugas">Petugas</SelectItem>
              <SelectItem value="peminjam">Peminjam</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {fieldErrors.role && (
          <p className="text-xs text-destructive">{fieldErrors.role[0]}</p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Batal
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Spinner data-icon="inline-start" />}
          {isSubmitting ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>
    </form>
  )
}
