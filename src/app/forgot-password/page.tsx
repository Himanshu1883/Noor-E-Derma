"use client"

import Link from "next/link"
import { useState, type FormEvent } from "react"
import { toast } from "sonner"
import { GoldButton } from "@/components/GoldButton"
import { Logo } from "@/components/Logo"
import { api } from "@/lib/client"

export default function Page() {
  const [pending, setPending] = useState(false)
  const [sent, setSent] = useState(false)

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setPending(true)
    try {
      await api("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: new FormData(e.currentTarget).get("email") }),
      })
      setSent(true)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not submit your request")
    } finally {
      setPending(false)
    }
  }

  return (
    <main className="dewy relative flex min-h-svh items-center px-5 py-16">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <div className="rounded-[28px] bg-ivory p-7 ring-1 ring-sage-100">
          <p className="eyebrow">Account</p>
          <h1 className="mt-2 text-4xl">Forgot password</h1>
          <p className="mt-2 text-sm text-ink/60">Enter the email on your account. We’ll take it from there.</p>
          <form onSubmit={onSubmit} className="mt-6 space-y-3">
            <label className="block">
              <span className="mb-1.5 block text-[12px] tracking-[0.16em] text-ink/50 uppercase">Email</span>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full rounded-full bg-white px-4 py-3 text-sm outline-none ring-1 ring-sage-100 focus:ring-gold/50"
              />
            </label>
            <GoldButton type="submit" className="w-full" loading={pending}>
              Request reset
            </GoldButton>
          </form>
          <p className="mt-5 text-center text-sm text-ink/60">
            Remembered it?{" "}
            <Link href="/?auth=login" className="text-sage-700 underline-offset-2 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {sent ? (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
          <button type="button" aria-label="Close" className="absolute inset-0 bg-sage-800/35 backdrop-blur-[3px]" onClick={() => setSent(false)} />
          <div role="dialog" aria-modal="true" aria-labelledby="forgot-sent-title" className="relative w-full max-w-[400px] rounded-[28px] bg-ivory p-7 shadow-[0_28px_70px_-24px_rgb(var(--tint)/0.5)] ring-1 ring-sage-100">
            <p className="eyebrow">Account</p>
            <h2 id="forgot-sent-title" className="mt-2 text-3xl">
              Request received
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink/70">
              We’ve received your request. A password reset link will be sent to your email shortly. Please check your inbox and follow the link to choose a new password.
            </p>
            <GoldButton type="button" className="mt-6 w-full" onClick={() => setSent(false)}>
              Close
            </GoldButton>
            <p className="mt-4 text-center text-sm">
              <Link href="/?auth=login" className="text-sage-700 underline-offset-2 hover:underline">
                Back to sign in
              </Link>
            </p>
          </div>
        </div>
      ) : null}
    </main>
  )
}
