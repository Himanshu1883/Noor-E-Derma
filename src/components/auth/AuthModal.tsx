"use client"

import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState, type FormEvent } from "react"
import { toast } from "sonner"
import { GoldButton } from "@/components/GoldButton"
import { useAuth } from "@/context/AuthContext"
import { useUI, type AuthMode } from "@/context/UIContext"
import { getLenis } from "@/hooks/useLenis"
import { api } from "@/lib/client"

function GoogleMark() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
      <path fill="none" d="M0 0h48v48H0z" />
    </svg>
  )
}

function GoogleButton({ label }: { label: string }) {
  return (
    <a
      href="/api/auth/google"
      className="flex h-10 w-full items-center justify-center gap-[10px] rounded-[4px] border border-[#747775] bg-white px-3 text-[14px] leading-5 font-medium tracking-[0.25px] text-[#1f1f1f] transition hover:bg-[#f8faff] hover:shadow-[0_1px_2px_0_rgba(60,64,67,0.3),0_1px_3px_1px_rgba(60,64,67,0.15)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b57d0] active:bg-[#f1f3f4]"
      style={{ fontFamily: "Roboto, Arial, sans-serif" }}
    >
      <GoogleMark />
      <span>{label}</span>
    </a>
  )
}

function Field({
  name,
  label,
  type = "text",
  autoComplete,
}: {
  name: string
  label: string
  type?: string
  autoComplete?: string
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] tracking-[0.16em] text-ink/50 uppercase">{label}</span>
      <input
        name={name}
        type={type}
        required
        autoComplete={autoComplete}
        className="w-full rounded-full bg-white px-4 py-3 text-sm outline-none ring-1 ring-sage-100 focus:ring-gold/50"
      />
    </label>
  )
}

function AuthModalInner() {
  const { refresh } = useAuth()
  const { authOpen, authMode, authNext, authError, openAuth, closeAuth } = useUI()
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const [pending, setPending] = useState(false)
  const authQuery = params.get("auth")
  const errorQuery = params.get("error")
  const nextQuery = params.get("next") ?? ""

  useEffect(() => {
    if (authQuery !== "login" && authQuery !== "register" && authQuery !== "forgot" && !errorQuery) return
    openAuth((authQuery as AuthMode) || "login", { next: nextQuery, error: errorQuery ?? "" })
    const url = new URL(window.location.href)
    url.searchParams.delete("auth")
    url.searchParams.delete("error")
    url.searchParams.delete("next")
    router.replace(url.pathname + url.search, { scroll: false })
  }, [authQuery, errorQuery, nextQuery, openAuth, router])

  useEffect(() => {
    if (!authOpen) return
    const lenis = getLenis()
    document.body.style.overflow = "hidden"
    lenis?.stop()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAuth()
    }
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = ""
      lenis?.start()
      window.removeEventListener("keydown", onKey)
    }
  }, [authOpen, closeAuth])

  const go = (href: string) => {
    closeAuth()
    router.push(href)
    router.refresh()
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    setPending(true)
    try {
      if (authMode === "forgot") {
        const data = await api<{ message: string }>("/api/auth/forgot-password", {
          method: "POST",
          body: JSON.stringify({ email: form.get("email") }),
        })
        toast.success(data.message)
        openAuth("login", { next: authNext })
        return
      }
      if (authMode === "register") {
        await api("/api/auth/register", {
          method: "POST",
          body: JSON.stringify({
            name: form.get("name"),
            email: form.get("email"),
            password: form.get("password"),
          }),
        })
        toast.success("Account created. Check your email to verify.")
      } else {
        await api("/api/auth/login", {
          method: "POST",
          body: JSON.stringify({ email: form.get("email"), password: form.get("password") }),
        })
        toast.success("Signed in")
      }
      await refresh()
      go(authNext || (pathname === "/" ? "/account" : pathname))
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setPending(false)
    }
  }

  const title = authMode === "register" ? "Create account" : authMode === "forgot" ? "Reset password" : "Sign in"
  const googleLabel = authMode === "register" ? "Sign up with Google" : "Sign in with Google"

  return (
    <AnimatePresence>
      {authOpen ? (
        <motion.div
          key="auth-modal"
          className="fixed inset-0 z-[90]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Close sign in"
            className="absolute inset-0 bg-sage-800/30 backdrop-blur-[3px]"
            onClick={closeAuth}
          />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-3">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="auth-title"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto w-full max-w-[420px]"
            >
              <div className="max-h-[min(92svh,640px)] overflow-y-auto rounded-[28px] bg-ivory p-6 shadow-[0_28px_70px_-24px_rgb(var(--tint)/0.5)] ring-1 ring-sage-100 [scrollbar-width:none] md:p-8">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="eyebrow">{authMode === "register" ? "Join the ritual" : "Welcome back"}</p>
                    <h2 id="auth-title" className="mt-2 text-3xl">
                      {title}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={closeAuth}
                    className="grid h-9 w-9 place-items-center rounded-full bg-white ring-1 ring-sage-100"
                    aria-label="Close"
                  >
                    <X size={16} />
                  </button>
                </div>

                {authError ? <p className="mt-3 text-sm text-red-700">{authError}</p> : null}

                {authMode !== "forgot" ? (
                  <>
                    <div className="mt-6">
                      <GoogleButton label={googleLabel} />
                    </div>
                    <div className="my-5 flex items-center gap-3 text-[11px] tracking-[0.18em] text-ink/40 uppercase">
                      <span className="h-px flex-1 bg-sage-100" />
                      or email
                      <span className="h-px flex-1 bg-sage-100" />
                    </div>
                  </>
                ) : (
                  <p className="mt-4 text-sm text-ink/60">We’ll send a reset link if that email has an account.</p>
                )}

                <form onSubmit={onSubmit} className="space-y-3">
                  {authMode === "register" ? <Field name="name" label="Name" autoComplete="name" /> : null}
                  <Field name="email" label="Email" type="email" autoComplete="email" />
                  {authMode !== "forgot" ? (
                    <Field
                      name="password"
                      label="Password"
                      type="password"
                      autoComplete={authMode === "login" ? "current-password" : "new-password"}
                    />
                  ) : null}
                  {authMode === "login" ? (
                    <p className="text-right text-[12px]">
                      <button type="button" className="text-sage-600 hover:underline" onClick={() => openAuth("forgot", { next: authNext })}>
                        Forgot password?
                      </button>
                    </p>
                  ) : authMode === "register" ? (
                    <p className="text-[12px] text-ink/50">Use at least 8 characters with a letter and a number.</p>
                  ) : null}
                  <GoldButton type="submit" className="mt-1 w-full">
                    {pending ? "Please wait…" : authMode === "forgot" ? "Send reset link" : authMode === "register" ? "Create account" : "Sign in"}
                  </GoldButton>
                </form>

                <p className="mt-5 text-center text-sm text-ink/60">
                  {authMode === "register" ? (
                    <>
                      Already have an account?{" "}
                      <button type="button" className="text-sage-700 underline-offset-2 hover:underline" onClick={() => openAuth("login", { next: authNext })}>
                        Sign in
                      </button>
                    </>
                  ) : (
                    <>
                      New here?{" "}
                      <button type="button" className="text-sage-700 underline-offset-2 hover:underline" onClick={() => openAuth("register", { next: authNext })}>
                        Create an account
                      </button>
                    </>
                  )}
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export function AuthModal() {
  return (
    <Suspense>
      <AuthModalInner />
    </Suspense>
  )
}
