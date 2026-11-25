"use client"

import { useState, type FormEvent } from "react"
import { toast } from "sonner"
import { AdminCard, AdminHeader, fieldClass, initials, labelClass } from "@/components/admin/ui"
import { GoldButton } from "@/components/GoldButton"
import { useAuth } from "@/context/AuthContext"
import { api } from "@/lib/client"
import type { PublicUser } from "@/lib/auth/types"

export default function AdminProfilePage() {
  const { user, applyUser, refresh } = useAuth()
  const [pending, setPending] = useState(false)
  const [pwPending, setPwPending] = useState(false)

  if (!user) return null

  const save = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    setPending(true)
    try {
      const data = await api<{ user: PublicUser }>("/api/account/profile", {
        method: "PATCH",
        body: JSON.stringify({ name: form.get("name"), phone: form.get("phone") }),
      })
      applyUser(data.user)
      toast.success("Profile updated")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update profile")
    } finally {
      setPending(false)
    }
  }

  const changePassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    setPwPending(true)
    try {
      const res = await api<{ message: string }>("/api/account/password", {
        method: "POST",
        body: JSON.stringify({ currentPassword: data.get("currentPassword"), newPassword: data.get("newPassword") }),
      })
      toast.success(res.message)
      form.reset()
      await refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not change password")
    } finally {
      setPwPending(false)
    }
  }

  return (
    <div>
      <AdminHeader eyebrow="Account" title="Profile" description="Your admin name, phone, and password. This is separate from store settings." />
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <AdminCard className="p-6">
          <div className="mb-5 flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-sage-800 text-sm text-white">{initials(user.name)}</span>
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-[12px] text-ink/65">{user.email}</p>
            </div>
          </div>
          <form onSubmit={save} className="space-y-4">
            <label className="block">
              <span className={labelClass}>Name</span>
              <input name="name" required defaultValue={user.name} className={fieldClass} />
            </label>
            <label className="block">
              <span className={labelClass}>Phone</span>
              <input name="phone" defaultValue={user.phone} className={fieldClass} />
            </label>
            <GoldButton type="submit" loading={pending}>
              {pending ? "Saving" : "Save profile"}
            </GoldButton>
          </form>
        </AdminCard>
        <AdminCard className="p-6">
          <h2 className="text-2xl">Password</h2>
          <form onSubmit={changePassword} className="mt-5 space-y-4">
            <label className="block">
              <span className={labelClass}>Current password</span>
              <input name="currentPassword" type="password" required className={fieldClass} />
            </label>
            <label className="block">
              <span className={labelClass}>New password</span>
              <input name="newPassword" type="password" required minLength={8} className={fieldClass} />
            </label>
            <GoldButton type="submit" loading={pwPending}>
              {pwPending ? "Updating" : "Update password"}
            </GoldButton>
          </form>
        </AdminCard>
      </div>
    </div>
  )
}
