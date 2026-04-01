"use client"

import type { FieldErrors } from "@/lib/types/api"

import { useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import {
  extractErrorMessage,
  extractFieldErrors,
  useLogin,
} from "@/hooks/use-auth"

const isDev = process.env.NODE_ENV === "development"

export default function LoginPage() {
  const [email, setEmail] = useState(isDev ? "admin@pinjamly.test" : "")
  const [password, setPassword] = useState(isDev ? "Password123" : "")
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [globalError, setGlobalError] = useState("")
  const login = useLogin()

  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault()
    setFieldErrors({})
    setGlobalError("")

    login.mutate(
      { email, password },
      {
        onError: (err) => {
          const fe = extractFieldErrors(err)
          if (fe) {
            setFieldErrors(fe)
          } else {
            setGlobalError(extractErrorMessage(err))
          }
        },
      }
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-primary font-heading text-xl font-bold text-primary-foreground">
          P
        </div>
        <CardTitle className="font-heading text-2xl">
          Masuk ke Pinjamly
        </CardTitle>
        <CardDescription>Sistem Peminjaman Alat</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {globalError && (
            <Alert variant="destructive">
              <AlertDescription>{globalError}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="email"
              className={fieldErrors.email ? "text-destructive" : ""}
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="nama@email.com"
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
              htmlFor="password"
              className={fieldErrors.password ? "text-destructive" : ""}
            >
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={!!fieldErrors.password}
              required
            />
            {fieldErrors.password && (
              <p className="text-xs text-destructive">
                {fieldErrors.password[0]}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={login.isPending}>
            {login.isPending && <Spinner data-icon="inline-start" />}
            {login.isPending ? "Memproses..." : "Masuk"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
