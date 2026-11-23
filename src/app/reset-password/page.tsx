"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useState, type FormEvent } from "react"
import { toast } from "sonner"
import { GoldButton } from "@/components/GoldButton"
import { api } from "@/lib/client"

function ResetInner() {
  const params = useSearchParams()
  const router = useRouter()
  const token = params.get("token") ?? ""
  const [pending, setPending] = useState(false)
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    setPending(true)
    try {
      const data = await api<{ message: string }>("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password: form.get("password") }),
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
    <main className="dewy flex min-h-svh items-center px-5 py-16">
      <form onSubmit={onSubmit} className="mx-auto w-full max-w-md rounded-[28px] bg-ivory p-7 ring-1 ring-sage-100">
        <h1 className="text-4xl">New password</h1>
        <input name="password" type="password" required minLength={8} className="mt-6 w-full rounded-full bg-white px-4 py-3 text-sm ring-1 ring-sage-100" placeholder="New password" />
        <GoldButton type="submit" className="mt-4 w-full">
          {pending ? "Saving…" : "Update password"}
        </GoldButton>
      </form>
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
