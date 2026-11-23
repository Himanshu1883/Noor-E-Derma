"use client"

import { Search, Users } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { AdminCard, AdminHeader, EmptyState, fieldClass, formatDate, initials, Pill, statusTone } from "@/components/admin/ui"
import { api } from "@/lib/client"

type User = {
  _id: string
  name: string
  email: string
  role: string
  status: string
  phone?: string
  googleId?: string
  createdAt?: string
  lastLoginAt?: string
  emailVerifiedAt?: string
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [q, setQ] = useState("")
  const load = () => api<{ users: User[] }>("/api/admin/users").then((d) => setUsers(d.users))
  useEffect(() => {
    void load()
  }, [])

  const visible = useMemo(() => {
    const needle = q.trim().toLowerCase()
    if (!needle) return users
    return users.filter((u) => [u.name, u.email, u.phone, u.role].join(" ").toLowerCase().includes(needle))
  }, [users, q])

  const customers = users.filter((u) => u.role === "customer").length
  const admins = users.filter((u) => u.role === "admin").length

  return (
    <div>
      <AdminHeader
        eyebrow="Accounts"
        title="Customers"
        description="Everyone with a NOOR E DERMA account — shoppers, Google sign-ins, and admins."
      />

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <AdminCard className="p-4">
          <p className="text-[11px] tracking-[0.16em] text-ink/45 uppercase">Accounts</p>
          <p className="mt-1 font-display text-3xl">{users.length}</p>
        </AdminCard>
        <AdminCard className="p-4">
          <p className="text-[11px] tracking-[0.16em] text-ink/45 uppercase">Customers</p>
          <p className="mt-1 font-display text-3xl">{customers}</p>
        </AdminCard>
        <AdminCard className="p-4">
          <p className="text-[11px] tracking-[0.16em] text-ink/45 uppercase">Admins</p>
          <p className="mt-1 font-display text-3xl">{admins}</p>
        </AdminCard>
      </div>

      <div className="mt-6 flex justify-end">
        <label className="relative w-full max-w-xs">
          <Search size={14} className="absolute top-1/2 left-3 -translate-y-1/2 text-ink/35" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or email" className={`${fieldClass} pl-9`} />
        </label>
      </div>

      <AdminCard className="mt-4 overflow-hidden">
        {visible.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-sage-50/60 text-[11px] tracking-[0.16em] text-ink/45 uppercase">
                <tr>
                  <th className="px-4 py-3 font-medium">Person</th>
                  <th className="font-medium">Contact</th>
                  <th className="font-medium">Role</th>
                  <th className="font-medium">Joined</th>
                  <th className="font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((u) => (
                  <tr key={u._id} className="border-t border-sage-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="grid h-10 w-10 place-items-center rounded-full bg-sage-50 text-[11px] font-medium text-sage-800">
                          {initials(u.name)}
                        </span>
                        <div>
                          <p className="font-medium">{u.name}</p>
                          <p className="text-[11px] text-ink/45">{u.googleId ? "Google" : "Email"}{u.emailVerifiedAt ? " · verified" : ""}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <p>{u.email}</p>
                      <p className="text-[12px] text-ink/45">{u.phone || "No phone"}</p>
                    </td>
                    <td>
                      <Pill tone={u.role === "admin" ? "gold" : "neutral"}>{u.role}</Pill>
                    </td>
                    <td className="text-[12px] text-ink/55">
                      <p>{formatDate(u.createdAt)}</p>
                      <p>Last {formatDate(u.lastLoginAt)}</p>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={async () => {
                          const status = u.status === "active" ? "disabled" : "active"
                          try {
                            await api(`/api/admin/users/${u._id}`, { method: "PATCH", body: JSON.stringify({ status }) })
                            toast.success("User updated")
                            await load()
                          } catch (e) {
                            toast.error(e instanceof Error ? e.message : "Failed")
                          }
                        }}
                      >
                        <Pill tone={statusTone(u.status)}>{u.status}</Pill>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState icon={<Users size={22} />} title="No customers yet" body="New accounts from email or Google sign-in will appear in this list." />
        )}
      </AdminCard>
    </div>
  )
}
