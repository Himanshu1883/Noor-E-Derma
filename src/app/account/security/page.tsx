"use client"

import { CheckCircle2, Lock, Mail, Shield } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, type FormEvent } from "react"
import { toast } from "sonner"
import { AccountCard, fieldClass } from "@/components/account/ui"
import { GoldButton } from "@/components/GoldButton"
import { useAuth } from "@/context/AuthContext"
import { api } from "@/lib/client"

export default function SecurityPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [twoFa, setTwoFa] = useState(false)

  const changePassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    try {
      const data = await api<{ message: string }>("/api/account/password", {
        method: "POST",
        body: JSON.stringify({ currentPassword: form.get("currentPassword"), newPassword: form.get("newPassword") }),
      })
      toast.success(data.message)
      await logout()
      router.push("/?auth=login")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not change password")
    }
  }

  return (
    <div>
      <p className="eyebrow">Account</p>
      <h1 className="mt-2 text-4xl md:text-5xl">Security</h1>
      <p className="mt-2 text-sm text-ink/55">Password, email verification, and extra protection for your account.</p>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <AccountCard>
          <h2 className="mb-4 flex items-center gap-2 text-lg">
            <Lock size={18} className="text-gold-deep" /> Change password
          </h2>
          <form onSubmit={changePassword} className="space-y-3">
            <input name="currentPassword" type="password" required placeholder="Current password" className={fieldClass} />
            <input name="newPassword" type="password" required minLength={8} placeholder="New password (8+ chars)" className={fieldClass} />
            <GoldButton type="submit" className="px-6 py-2.5 text-[12px]">
              Update password
            </GoldButton>
          </form>
        </AccountCard>

        <AccountCard>
          <h2 className="mb-4 flex items-center gap-2 text-lg">
            <Shield size={18} className="text-gold-deep" /> Account protection
          </h2>
          <div className="flex items-start justify-between gap-3 border-b border-sage-50 pb-4">
            <div className="flex gap-3">
              <Mail size={16} className="mt-0.5 text-ink/40" />
              <div>
                <p className="text-sm font-medium">Email verification</p>
                <p className="text-[12px] text-ink/50">{user?.email}</p>
              </div>
            </div>
            {user?.emailVerified ? (
              <span className="inline-flex items-center gap-1 text-[12px] font-medium text-emerald-700">
                <CheckCircle2 size={14} /> Verified
              </span>
            ) : (
              <span className="text-[12px] text-amber-800">Pending</span>
            )}
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">Two-factor authentication</p>
              <p className="text-[12px] text-ink/50">An extra step at sign-in. Rolling out at launch.</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={twoFa}
              onClick={() => {
                setTwoFa((v) => !v)
                toast("Two-factor authentication will be available at launch.")
              }}
              className={`relative h-6 w-11 shrink-0 rounded-full transition ${twoFa ? "gold-fill" : "bg-sage-100"}`}
            >
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${twoFa ? "left-[22px]" : "left-0.5"}`} />
            </button>
          </div>
        </AccountCard>
      </div>
    </div>
  )
}
