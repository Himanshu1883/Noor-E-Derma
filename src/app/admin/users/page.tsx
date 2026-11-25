"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, Users } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { AdminBusy, AdminCard, AdminHeader, EmptyState, fieldClass, formatDate, initials, Pill, statusTone } from "@/components/admin/ui"
import { api } from "@/lib/client"

type Address = {
  label?: string
  phone?: string
  line1?: string
  city?: string
  state?: string
  pincode?: string
}

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
  orderCount?: number
  addresses?: Address[]
}

export default function AdminUsers() {
  const router = useRouter()
  const [users, setUsers] = useState<User[] | null>(null)
  const [q, setQ] = useState("")
  const load = () => api<{ users: User[] }>("/api/admin/users").then((d) => setUsers(d.users))
  useEffect(() => {
    void load()
  }, [])

  const visible = useMemo(() => {
    const list = users ?? []
    const needle = q.trim().toLowerCase()
    if (!needle) return list
    return list.filter((u) => [u.name, u.email, u.phone, u.role, ...(u.addresses ?? []).map((a) => `${a.city} ${a.pincode}`)].join(" ").toLowerCase().includes(needle))
  }, [users, q])

  const customers = (users ?? []).filter((u) => u.role === "customer").length
  const admins = (users ?? []).filter((u) => u.role === "admin").length

  return (
    <div>
      <AdminHeader
        eyebrow="Accounts"
        title="Customers"
        description="Open a row for phone, address, and full order history with storefront product links."
      />

      {users == null ? (
        <AdminBusy label="Loading customers" />
      ) : (
        <>
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
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, email, phone" className={`${fieldClass} pl-9`} />
            </label>
          </div>

          <AdminCard className="mt-4 overflow-hidden">
            {visible.length ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[860px] text-left text-sm">
                  <thead className="bg-sage-50/60 text-[11px] tracking-[0.16em] text-ink/45 uppercase">
                    <tr>
                      <th className="px-4 py-3 font-medium">Person</th>
                      <th className="font-medium">Contact</th>
                      <th className="font-medium">Address</th>
                      <th className="font-medium">Orders</th>
                      <th className="font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((u) => {
                      const address = u.addresses?.find((a) => a.city) ?? u.addresses?.[0]
                      return (
                        <tr
                          key={u._id}
                          className="cursor-pointer border-t border-sage-50 hover:bg-sage-50/50"
                          onClick={() => router.push(`/admin/users/${u._id}`)}
                        >
                          <td className="px-4 py-3">
                            <Link href={`/admin/users/${u._id}`} className="flex items-center gap-3 hover:text-sage-800">
                              <span className="grid h-10 w-10 place-items-center rounded-full bg-sage-50 text-[11px] font-medium text-sage-800">
                                {initials(u.name)}
                              </span>
                              <div>
                                <p className="font-medium">{u.name}</p>
                                <p className="text-[11px] text-ink/45">
                                  {u.googleId ? "Google" : "Email"}
                                  {u.emailVerifiedAt ? " · verified" : ""} · {u.role}
                                </p>
                              </div>
                            </Link>
                          </td>
                          <td>
                            <p>{u.email}</p>
                            <p className="text-[12px] text-ink/45">{u.phone || address?.phone || "No phone"}</p>
                          </td>
                          <td className="max-w-[220px] text-[12px] text-ink/60">
                            {address?.line1 ? (
                              <p>
                                {address.line1}
                                {address.city ? `, ${address.city}` : ""}
                                {address.pincode ? ` ${address.pincode}` : ""}
                              </p>
                            ) : (
                              "No address"
                            )}
                          </td>
                          <td>
                            <Link href={`/admin/users/${u._id}`} className="text-sage-700 hover:underline">
                              {u.orderCount ?? 0} orders
                            </Link>
                            <p className="text-[11px] text-ink/40">Joined {formatDate(u.createdAt)}</p>
                          </td>
                          <td>
                            <button
                              type="button"
                              onClick={async (e) => {
                                e.stopPropagation()
                                const status = u.status === "active" ? "disabled" : "active"
                                try {
                                  await api(`/api/admin/users/${u._id}`, { method: "PATCH", body: JSON.stringify({ status }) })
                                  toast.success("User updated")
                                  await load()
                                } catch (err) {
                                  toast.error(err instanceof Error ? err.message : "Failed")
                                }
                              }}
                            >
                              <Pill tone={statusTone(u.status)}>{u.status}</Pill>
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState icon={<Users size={22} />} title="No customers yet" body="New accounts from email or Google sign-in will appear in this list." />
            )}
          </AdminCard>
        </>
      )}
    </div>
  )
}
