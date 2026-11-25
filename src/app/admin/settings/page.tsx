"use client"

import Link from "next/link"
import { useEffect, useState, type FormEvent } from "react"
import { toast } from "sonner"
import { AdminBusy, AdminCard, AdminHeader, fieldClass, hintClass, labelClass } from "@/components/admin/ui"
import { GoldButton } from "@/components/GoldButton"
import { api } from "@/lib/client"

type Settings = {
  storeName: string
  supportEmail: string
  supportPhone: string
  shippingFee: number
  freeShippingOver: number
  taxPercent: number
  lowStockThreshold: number
  announcement: string
  paymentsEnabled: boolean
}

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      {children}
      {hint ? <span className={hintClass}>{hint}</span> : null}
    </label>
  )
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [pending, setPending] = useState(false)
  useEffect(() => {
    api<{ settings: Settings }>("/api/admin/settings").then((d) => setSettings(d.settings))
  }, [])
  if (!settings) {
    return (
      <div>
        <AdminHeader eyebrow="Store" title="Settings" />
        <AdminBusy label="Loading settings" />
      </div>
    )
  }
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    setPending(true)
    try {
      await api("/api/admin/settings", {
        method: "PATCH",
        body: JSON.stringify({
          storeName: form.get("storeName"),
          supportEmail: form.get("supportEmail"),
          supportPhone: form.get("supportPhone"),
          shippingFee: Number(form.get("shippingFee")),
          freeShippingOver: Number(form.get("freeShippingOver")),
          taxPercent: Number(form.get("taxPercent")),
          lowStockThreshold: Number(form.get("lowStockThreshold")),
          announcement: form.get("announcement"),
          paymentsEnabled: form.get("paymentsEnabled") === "on",
        }),
      })
      toast.success("Settings saved")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed")
    } finally {
      setPending(false)
    }
  }
  return (
    <div>
      <AdminHeader
        eyebrow="Store"
        title="Settings"
        description="How NOOR E DERMA presents itself at checkout — support, shipping, tax, and the announcement bar."
        actions={
          <Link href="/admin/profile" className="text-[12px] text-sage-700 hover:underline">
            Admin profile
          </Link>
        }
      />
      <form onSubmit={onSubmit} className="mt-8 grid gap-6 lg:grid-cols-2">
        <AdminCard className="p-6">
          <h2 className="text-2xl">Brand & support</h2>
          <div className="mt-5 space-y-4">
            <Field label="Store name">
              <input name="storeName" defaultValue={settings.storeName} className={fieldClass} />
            </Field>
            <Field label="Support email">
              <input name="supportEmail" defaultValue={settings.supportEmail} className={fieldClass} />
            </Field>
            <Field label="Support phone">
              <input name="supportPhone" defaultValue={settings.supportPhone} className={fieldClass} />
            </Field>
            <Field label="Announcement" hint="Shown as a slim bar on the storefront when filled.">
              <input name="announcement" defaultValue={settings.announcement} className={fieldClass} />
            </Field>
          </div>
        </AdminCard>
        <AdminCard className="p-6">
          <h2 className="text-2xl">Shipping & tax</h2>
          <div className="mt-5 space-y-4">
            <Field label="Shipping fee (₹)">
              <input name="shippingFee" type="number" defaultValue={settings.shippingFee} className={fieldClass} />
            </Field>
            <Field label="Free shipping over (₹)">
              <input name="freeShippingOver" type="number" defaultValue={settings.freeShippingOver} className={fieldClass} />
            </Field>
            <Field label="Tax percent">
              <input name="taxPercent" type="number" defaultValue={settings.taxPercent} className={fieldClass} />
            </Field>
            <Field label="Low-stock threshold" hint="Inventory flags a ritual when available units fall to this number.">
              <input name="lowStockThreshold" type="number" defaultValue={settings.lowStockThreshold} className={fieldClass} />
            </Field>
            <label className="flex items-center gap-3 rounded-2xl bg-ivory px-4 py-3 text-sm ring-1 ring-sage-100">
              <input type="checkbox" name="paymentsEnabled" defaultChecked={settings.paymentsEnabled} className="h-4 w-4" />
              Payments enabled
            </label>
            <GoldButton type="submit" loading={pending}>
              {pending ? "Saving" : "Save settings"}
            </GoldButton>
          </div>
        </AdminCard>
      </form>
    </div>
  )
}
