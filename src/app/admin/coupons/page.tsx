"use client"

import { Tag } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { AdminCard, AdminHeader, EmptyState, fieldClass, formatDate, Pill } from "@/components/admin/ui"
import { GoldButton } from "@/components/GoldButton"
import { api } from "@/lib/client"
import { formatINR } from "@/lib/format"

type Coupon = {
  _id: string
  code: string
  type: string
  value: number
  minSubtotal: number
  usedCount: number
  maxUses: number
  active: boolean
  expiresAt?: string
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const load = () => api<{ coupons: Coupon[] }>("/api/admin/coupons").then((d) => setCoupons(d.coupons))
  useEffect(() => {
    void load()
  }, [])

  return (
    <div>
      <AdminHeader
        eyebrow="Promotions"
        title="Coupons"
        description="Launch codes, first-order gifts, and sitewide cuts. Usage counts only tick on paid orders."
      />

      <form
        className="mt-6 grid gap-3 rounded-[24px] bg-white p-5 ring-1 ring-sage-100 md:grid-cols-4"
        onSubmit={async (e) => {
          e.preventDefault()
          const form = e.currentTarget
          const data = new FormData(form)
          try {
            await api("/api/admin/coupons", {
              method: "POST",
              body: JSON.stringify({
                code: data.get("code"),
                type: data.get("type"),
                value: Number(data.get("value")),
                minSubtotal: Number(data.get("min") || 0),
                maxUses: Number(data.get("max") || 0),
              }),
            })
            toast.success("Coupon created")
            form.reset()
            await load()
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed")
          }
        }}
      >
        <input name="code" required placeholder="CODE" className={fieldClass} />
        <select name="type" className={fieldClass}>
          <option value="percent">Percent off</option>
          <option value="fixed">Fixed ₹ off</option>
        </select>
        <input name="value" type="number" required placeholder="Value" className={fieldClass} />
        <input name="min" type="number" placeholder="Min subtotal" className={fieldClass} />
        <input name="max" type="number" placeholder="Max uses (0 = open)" className={`${fieldClass} md:col-span-2`} />
        <div className="md:col-span-2">
          <GoldButton type="submit">Create coupon</GoldButton>
        </div>
      </form>

      {coupons.length ? (
        <ul className="mt-6 grid gap-3 md:grid-cols-2">
          {coupons.map((c) => {
            const cap = c.maxUses > 0 ? c.maxUses : Math.max(c.usedCount, 1)
            const pct = c.maxUses > 0 ? Math.min(100, Math.round((c.usedCount / cap) * 100)) : 0
            return (
              <li key={c._id}>
                <AdminCard className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-display text-3xl tracking-[0.08em]">{c.code}</p>
                      <p className="mt-1 text-sm text-ink/55">
                        {c.type === "percent" ? `${c.value}% off` : `${formatINR(c.value)} off`}
                        {c.minSubtotal ? ` · min ${formatINR(c.minSubtotal)}` : ""}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await api(`/api/admin/coupons/${c._id}`, {
                            method: "PATCH",
                            body: JSON.stringify({ active: !c.active }),
                          })
                          await load()
                        } catch (e) {
                          toast.error(e instanceof Error ? e.message : "Failed")
                        }
                      }}
                    >
                      <Pill tone={c.active ? "good" : "bad"}>{c.active ? "Active" : "Off"}</Pill>
                    </button>
                  </div>
                  <div className="mt-4">
                    <div className="h-1.5 overflow-hidden rounded-full bg-sage-50">
                      <div className="h-full rounded-full bg-sage-600" style={{ width: `${c.maxUses ? pct : 8}%` }} />
                    </div>
                    <p className="mt-2 text-[12px] text-ink/45">
                      Used {c.usedCount}
                      {c.maxUses ? ` / ${c.maxUses}` : " · unlimited"}
                      {c.expiresAt ? ` · expires ${formatDate(c.expiresAt)}` : ""}
                    </p>
                  </div>
                </AdminCard>
              </li>
            )
          })}
        </ul>
      ) : (
        <AdminCard className="mt-6">
          <EmptyState icon={<Tag size={22} />} title="No coupons yet" body="Create a code above. It will only increment when an order is paid." />
        </AdminCard>
      )}
    </div>
  )
}
