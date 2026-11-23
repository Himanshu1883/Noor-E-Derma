"use client"

import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import { api } from "@/lib/client"

function VerifyInner() {
  const token = useSearchParams().get("token") ?? ""
  const [message, setMessage] = useState("Verifying…")
  useEffect(() => {
    if (!token) {
      setMessage("Missing verification token.")
      return
    }
    api<{ message: string }>("/api/auth/verify-email", { method: "POST", body: JSON.stringify({ token }) })
      .then((d) => setMessage(d.message))
      .catch((e) => setMessage(e instanceof Error ? e.message : "Verification failed"))
  }, [token])
  return (
    <main className="dewy flex min-h-svh items-center px-5 py-16">
      <div className="mx-auto max-w-md rounded-[28px] bg-ivory p-8 text-center ring-1 ring-sage-100">
        <h1 className="text-4xl">Email</h1>
        <p className="mt-4 text-ink/70">{message}</p>
      </div>
    </main>
  )
}

export default function Page() {
  return (
    <Suspense>
      <VerifyInner />
    </Suspense>
  )
}
