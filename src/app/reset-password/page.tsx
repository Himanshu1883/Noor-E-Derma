"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useState, type FormEvent } from "react"
import { toast } from "sonner"
import { GoldButton } from "@/components/GoldButton"
import { Logo } from "@/components/Logo"
import { PasswordField } from "@/components/PasswordField"
import { api } from "@/lib/client"

const field =
  "w-full rounded-full bg-white px-4 py-3 text-sm outline-none ring-1 ring-sage-100 focus:ring-gold/50"

function ResetInner() {
  const params = useSearchParams()
  const router = useRouter()
  const token = params.get("token") ?? ""
  const [pending, setPending] = useState(false)

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const password = String(form.get("password") ?? "")
    const confirmPassword = String(form.get("confirmPassword") ?? "")
    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }
    setPending(true)
    try {
      const data = await api<{ message: string }>("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password, confirmPassword }),
      })
      toast.success(data.message)
      router.push("/?auth=login")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Reset failed")
    } finally {
      setPending(false)
    }
  }

  return (
    <main className="dewy flex min-h-svh min-w-0 max-w-full items-center overflow-x-clip px-5 py-16">
      <div className="mx-auto w-full max-w-[420px]">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <div className="rounded-[28px] bg-ivory p-7 shadow-[0_28px_70px_-24px_rgb(var(--tint)/0.5)] ring-1 ring-sage-100 md:p-8">
          <p className="eyebrow">Account</p>
          <h1 className="mt-2 text-4xl">Set a new password</h1>
          {token ? (
            <>
              <p className="mt-2 text-sm text-ink/60">Choose a new password, then sign in with it.</p>
              <form onSubmit={onSubmit} className="mt-6 space-y-3">
                <PasswordField
                  name="password"
                  label="New password"
                  autoComplete="new-password"
                  minLength={8}
                  className={field}
                />
                <PasswordField
                  name="confirmPassword"
                  label="Confirm new password"
                  autoComplete="new-password"
                  minLength={8}
                  className={field}
                />
                <p className="text-[12px] text-ink/50">Use at least 8 characters with a letter and a number.</p>
                <GoldButton type="submit" className="w-full" loading={pending}>
                  Save password
                </GoldButton>
              </form>
            </>
          ) : (
            <>
              <p className="mt-3 text-sm text-ink/70">This reset link is missing or incomplete. Request a new one from sign in.</p>
              <Link href="/?auth=forgot" className="mt-6 inline-flex">
                <GoldButton type="button">Forgot password</GoldButton>
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  )
}

export default function Page() {
  return (
    <Suspense>
      <ResetInner />
    </Suspense>
  )
}
