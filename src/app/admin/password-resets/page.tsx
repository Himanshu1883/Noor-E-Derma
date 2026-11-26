"use client"

import Link from "next/link"
import { KeyRound } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { AdminBusy, AdminCard, AdminHeader, EmptyState, Pill, formatDateTime, prettyStatus, statusTone } from "@/components/admin/ui"
import { GoldButton } from "@/components/GoldButton"
import { api } from "@/lib/client"

type ResetRow = {
  _id: string
  userId: string
  email: string
  name: string
  status: "pending" | "sent" | "completed"
  requestedAt?: string
  sentAt?: string
  usedAt?: string
  sendCount: number
}

export default function PasswordResetsPage() {
  const [rows, setRows] = useState<ResetRow[] | null>(null)
  const [sending, setSending] = useState<string | null>(null)

  const load = () => api<{ requests: ResetRow[] }>("/api/admin/password-resets").then((d) => setRows(d.requests))

  useEffect(() => {
    void load()
  }, [])

  const send = async (id: string) => {
    setSending(id)
    try {
      const data = await api<{ emailed: boolean }>(`/api/admin/password-resets/${id}/send`, { method: "POST" })
      toast.success(
        data.emailed
          ? "Reset link sent to the customer’s email"
          : "Reset link issued. Configure SMTP to deliver the email to the customer.",
      )
      await load()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send reset link")
    } finally {
      setSending(null)
    }
  }

  const pending = (rows ?? []).filter((r) => r.status === "pending").length

  return (
    <div>
      <AdminHeader
        eyebrow="Accounts"
        title="Password resets"
        description="Customers who asked for a new password. Send the email link when you are ready — they set a new password from that page."
      />

      {rows == null ? (
        <AdminBusy label="Loading reset requests" />
      ) : (
        <>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <AdminCard className="p-4">
              <p className="text-[11px] tracking-[0.16em] text-ink/45 uppercase">Waiting</p>
              <p className="mt-1 font-display text-3xl">{pending}</p>
            </AdminCard>
            <AdminCard className="p-4">
              <p className="text-[11px] tracking-[0.16em] text-ink/45 uppercase">Sent</p>
              <p className="mt-1 font-display text-3xl">{rows.filter((r) => r.status === "sent").length}</p>
            </AdminCard>
            <AdminCard className="p-4">
              <p className="text-[11px] tracking-[0.16em] text-ink/45 uppercase">Completed</p>
              <p className="mt-1 font-display text-3xl">{rows.filter((r) => r.status === "completed").length}</p>
            </AdminCard>
          </div>

          <AdminCard className="mt-5 overflow-hidden">
            {rows.length ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-[11px] tracking-[0.14em] text-ink/40 uppercase">
                    <tr>
                      <th className="px-5 py-3 font-medium">Customer</th>
                      <th className="px-5 py-3 font-medium">Requested</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                      <th className="px-5 py-3 font-medium" />
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r._id} className="border-t border-sage-50">
                        <td className="px-5 py-4">
                          <Link href={`/admin/users/${r.userId}`} className="font-medium hover:text-sage-800">
                            {r.name || r.email}
                          </Link>
                          <p className="text-[12px] text-ink/45">{r.email}</p>
                        </td>
                        <td className="px-5 py-4 text-ink/70">{formatDateTime(r.requestedAt)}</td>
                        <td className="px-5 py-4">
                          <Pill tone={statusTone(r.status)}>{prettyStatus(r.status)}</Pill>
                          {r.sendCount > 0 ? <p className="mt-1 text-[11px] text-ink/40">Sent {r.sendCount}×</p> : null}
                        </td>
                        <td className="px-5 py-4 text-right">
                          {r.status === "completed" ? (
                            <span className="text-[12px] text-ink/40">Used {formatDateTime(r.usedAt)}</span>
                          ) : (
                            <GoldButton
                              size="sm"
                              type="button"
                              loading={sending === r._id}
                              onClick={() => void send(r._id)}
                            >
                              {r.status === "sent" ? "Send again" : "Send link"}
                            </GoldButton>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState
                icon={<KeyRound size={22} />}
                title="No reset requests"
                body="When a customer uses Forgot password, the request appears here. Send the email link when you are ready."
              />
            )}
          </AdminCard>
        </>
      )}
    </div>
  )
}
