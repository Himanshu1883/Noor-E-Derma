"use client"

import { useState, type FormEvent } from "react"
import { toast } from "sonner"
import { GoldButton } from "@/components/GoldButton"
import { Logo } from "@/components/Logo"
import { api } from "@/lib/client"

export default function Page() {
  const [pending, setPending] = useState(false)
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setPending(true)
    try {
      const form = new FormData(e.currentTarget)
      const data = await api<{ message: string }>("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: form.get("email") }),
      })
      toast.success(data.message)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send reset email")
    } finally {
      setPending(false)
    }
  }
  return (
    <main className="dewy flex min-h-svh items-center px-5 py-16">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <div className="rounded-[28px] bg-ivory p-7 ring-1 ring-sage-100">
          <p className="eyebrow">Account</p>
          <h1 className="mt-2 text-4xl">Reset password</h1>
          <form onSubmit={onSubmit} className="mt-6 space-y-3">
            <input name="email" type="email" required placeholder="Email" className="w-full rounded-full bg-white px-4 py-3 text-sm outline-none ring-1 ring-sage-100" />
            <GoldButton type="submit" className="w-full" loading={pending}>
              {pending ? "Sending" : "Send reset link"}
            </GoldButton>
          </form>
        </div>
      </div>
    </main>
  )
}
