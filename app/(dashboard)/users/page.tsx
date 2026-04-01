"use client"

import type { FieldErrors } from "@/lib/types/api"
import type {
  CreateUserRequest,
  UpdateUserRequest,
  User,
} from "@/lib/types/user"

import { useState } from "react"
import { UserForm } from "@/components/forms/user-form"
import { PageHeader } from "@/components/layout/page-header"
import { RoleGuard } from "@/components/role-guard"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { PageSkeleton } from "@/components/shared/loading-skeleton"
import { PaginationControls } from "@/components/shared/pagination-controls"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { extractFieldErrors } from "@/hooks/use-auth"
import {
  useCreateUser,
  useDeleteUser,
  useUpdateUser,
  useUsers,
} from "@/hooks/use-users"

export default function UsersPage() {
  return (
    <RoleGuard allowedRoles={["admin"]}>
      <UsersContent />
    </RoleGuard>
  )
}

function UsersContent() {
  const [page, setPage] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  const { data, isLoading } = useUsers(page)
  const createUser = useCreateUser()
  const updateUser = useUpdateUser()
  const deleteUser = useDeleteUser()

  function openCreate() {
    setEditingUser(null)
    setFieldErrors({})
    setDialogOpen(true)
  }

  function openEdit(user: User) {
    setEditingUser(user)
    setFieldErrors({})
    setDialogOpen(true)
  }

  function handleSubmit(formData: CreateUserRequest | UpdateUserRequest) {
    setFieldErrors({})
    if (editingUser) {
      updateUser.mutate(
        { id: editingUser.id, data: formData as UpdateUserRequest },
        {
          onSuccess: () => setDialogOpen(false),
          onError: (err) => {
            const fe = extractFieldErrors(err)
            if (fe) setFieldErrors(fe)
          },
        }
      )
    } else {
      createUser.mutate(formData as CreateUserRequest, {
        onSuccess: () => setDialogOpen(false),
        onError: (err) => {
          const fe = extractFieldErrors(err)
          if (fe) setFieldErrors(fe)
        },
      })
    }
  }

  if (isLoading) return <PageSkeleton />

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Pengguna"
        description="Kelola data pengguna sistem."
        actions={<Button onClick={openCreate}>Tambah Pengguna</Button>}
      />

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Dibuat</TableHead>
              <TableHead className="w-[100px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(user.created_at).toLocaleDateString("id-ID")}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEdit(user)}
                    >
                      Edit
                    </Button>
                    <ConfirmDialog
                      title="Hapus Pengguna"
                      description={`Yakin ingin menghapus ${user.name}?`}
                      trigger={
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                        >
                          Hapus
                        </Button>
                      }
                      onConfirm={() => deleteUser.mutateAsync(user.id)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {data?.data.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  Belum ada data pengguna.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {data?.meta && (
        <PaginationControls meta={data.meta} onPageChange={setPage} />
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingUser ? "Edit Pengguna" : "Tambah Pengguna"}
            </DialogTitle>
            <DialogDescription>
              {editingUser ? "Ubah data pengguna." : "Buat akun pengguna baru."}
            </DialogDescription>
          </DialogHeader>
          <UserForm
            user={editingUser}
            fieldErrors={fieldErrors}
            isSubmitting={createUser.isPending || updateUser.isPending}
            onSubmit={handleSubmit}
            onCancel={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
