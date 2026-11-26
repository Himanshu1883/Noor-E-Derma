"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import {
  Bell,
  CreditCard,
  Globe,
  Landmark,
  Mail,
  Package,
  Share2,
  Store,
} from "lucide-react"
import { AdminBusy, AdminCard, AdminHeader, fieldClass, hintClass, inputClass, labelClass } from "@/components/admin/ui"
import { GoldButton } from "@/components/GoldButton"
import { api } from "@/lib/client"
import { cn } from "@/lib/cn"
import { STORE_DEFAULTS, type StorefrontSettings } from "@/lib/storefront-settings"

const SECTIONS = [
  { id: "brand", label: "Brand", icon: Store },
  { id: "contact", label: "Contact", icon: Mail },
  { id: "announcement", label: "Announcement", icon: Bell },
  { id: "shipping", label: "Shipping & tax", icon: Package },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "inventory", label: "Inventory", icon: Landmark },
  { id: "social", label: "Social", icon: Share2 },
  { id: "store", label: "Store status", icon: Globe },
] as const

type SectionId = (typeof SECTIONS)[number]["id"]

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

function Toggle({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean
  onChange: (next: boolean) => void
  label: string
  hint?: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-start justify-between gap-4 rounded-2xl bg-ivory px-4 py-3.5 text-left ring-1 ring-sage-100"
    >
      <span>
        <span className="block text-sm font-medium">{label}</span>
        {hint ? <span className="mt-1 block text-[12px] text-ink/55">{hint}</span> : null}
      </span>
      <span className={cn("relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition", checked ? "gold-fill" : "bg-sage-100")}>
        <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition", checked ? "left-[22px]" : "left-0.5")} />
      </span>
    </button>
  )
}

export default function SettingsPage() {
  const [form, setForm] = useState<StorefrontSettings | null>(null)
  const [saved, setSaved] = useState<StorefrontSettings | null>(null)
  const [pending, setPending] = useState(false)
  const [section, setSection] = useState<SectionId>("brand")

  useEffect(() => {
    api<{ settings: StorefrontSettings }>("/api/admin/settings").then((d) => {
      const next = { ...STORE_DEFAULTS, ...d.settings }
      setForm(next)
      setSaved(next)
    })
  }, [])

  const dirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(saved), [form, saved])

  const set = <K extends keyof StorefrontSettings>(key: K, value: StorefrontSettings[K]) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev))
  }

  if (!form) {
    return (
      <div>
        <AdminHeader eyebrow="Store" title="Settings" />
        <AdminBusy label="Loading settings" />
      </div>
    )
  }

  const save = async () => {
    setPending(true)
    try {
      const data = await api<{ settings: StorefrontSettings }>("/api/admin/settings", {
        method: "PATCH",
        body: JSON.stringify(form),
      })
      const next = { ...STORE_DEFAULTS, ...data.settings }
      setForm(next)
      setSaved(next)
      toast.success("Storefront settings saved")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save settings")
    } finally {
      setPending(false)
    }
  }

  return (
    <div>
      <AdminHeader
        eyebrow="Store"
        title="Settings"
        description="Control how the storefront looks and sells — brand, contact, shipping, payments, and live banners."
        actions={
          <Link href="/" className="text-[12px] text-sage-700 hover:underline" target="_blank">
            View storefront
          </Link>
        }
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        <nav className="flex gap-1 overflow-x-auto lg:sticky lg:top-8 lg:block lg:space-y-1">
          {SECTIONS.map((item) => {
            const Icon = item.icon
            const on = section === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSection(item.id)}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-2xl px-3 py-2.5 text-[13px] whitespace-nowrap transition",
                  on ? "bg-white text-sage-800 ring-1 ring-sage-100" : "text-ink/60 hover:bg-white/70 hover:text-ink",
                )}
              >
                <Icon size={15} />
                {item.label}
              </button>
            )
          })}
        </nav>

        <div className="space-y-6">
          {section === "brand" ? (
            <AdminCard className="p-6">
              <h2 className="text-2xl">Brand</h2>
              <p className="mt-1 text-sm text-ink/55">Name and line that appear in the footer, emails, and browser title context.</p>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <Field label="Store name">
                  <input value={form.storeName} onChange={(e) => set("storeName", e.target.value)} className={fieldClass} />
                </Field>
                <Field label="Legal name">
                  <input value={form.legalName} onChange={(e) => set("legalName", e.target.value)} className={fieldClass} />
                </Field>
                <div className="md:col-span-2">
                  <Field label="Tagline" hint="Shown under the logo in the footer.">
                    <input value={form.tagline} onChange={(e) => set("tagline", e.target.value)} className={fieldClass} />
                  </Field>
                </div>
                <Field label="GSTIN" hint="Leave blank to hide on the storefront.">
                  <input value={form.gst} onChange={(e) => set("gst", e.target.value)} className={fieldClass} />
                </Field>
                <Field label="Address">
                  <input value={form.address} onChange={(e) => set("address", e.target.value)} className={fieldClass} />
                </Field>
              </div>
            </AdminCard>
          ) : null}

          {section === "contact" ? (
            <AdminCard className="p-6">
              <h2 className="text-2xl">Contact</h2>
              <p className="mt-1 text-sm text-ink/55">Used on Contact, Help, and footer. Empty phone or WhatsApp stays hidden.</p>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <Field label="Support email">
                  <input type="email" value={form.supportEmail} onChange={(e) => set("supportEmail", e.target.value)} className={fieldClass} />
                </Field>
                <Field label="Support phone">
                  <input value={form.supportPhone} onChange={(e) => set("supportPhone", e.target.value)} className={fieldClass} />
                </Field>
                <Field label="WhatsApp">
                  <input value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} className={fieldClass} />
                </Field>
                <Field label="Hours">
                  <input value={form.hours} onChange={(e) => set("hours", e.target.value)} className={fieldClass} />
                </Field>
                <div className="md:col-span-2">
                  <Field label="Footer note">
                    <textarea value={form.footerNote} onChange={(e) => set("footerNote", e.target.value)} rows={3} className={inputClass} />
                  </Field>
                </div>
              </div>
            </AdminCard>
          ) : null}

          {section === "announcement" ? (
            <AdminCard className="p-6">
              <h2 className="text-2xl">Announcement bar</h2>
              <p className="mt-1 text-sm text-ink/55">Slim gold-sage bar at the very top of the storefront.</p>
              <div className="mt-5 space-y-4">
                <Toggle
                  checked={form.announcementEnabled}
                  onChange={(v) => set("announcementEnabled", v)}
                  label="Show announcement"
                  hint="Needs both this toggle and a message."
                />
                <Field label="Message">
                  <input
                    value={form.announcement}
                    onChange={(e) => set("announcement", e.target.value)}
                    maxLength={160}
                    placeholder="Free shipping over ₹999 this week"
                    className={fieldClass}
                  />
                </Field>
                <Field label="Link (optional)" hint="If set, the whole bar is clickable. Use /shop or a full URL.">
                  <input
                    value={form.announcementLink}
                    onChange={(e) => set("announcementLink", e.target.value)}
                    placeholder="/shop"
                    className={fieldClass}
                  />
                </Field>
              </div>
            </AdminCard>
          ) : null}

          {section === "shipping" ? (
            <AdminCard className="p-6">
              <h2 className="text-2xl">Shipping & tax</h2>
              <p className="mt-1 text-sm text-ink/55">Applied live at checkout when the bag is quoted.</p>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <Field label="Shipping fee (₹)">
                  <input type="number" min={0} value={form.shippingFee} onChange={(e) => set("shippingFee", Number(e.target.value) || 0)} className={fieldClass} />
                </Field>
                <Field label="Free shipping over (₹)" hint="Set 0 to never offer free shipping.">
                  <input type="number" min={0} value={form.freeShippingOver} onChange={(e) => set("freeShippingOver", Number(e.target.value) || 0)} className={fieldClass} />
                </Field>
                <Field label="Tax percent" hint="Added on the discounted subtotal. 0 keeps prices as shown.">
                  <input type="number" min={0} max={40} value={form.taxPercent} onChange={(e) => set("taxPercent", Number(e.target.value) || 0)} className={fieldClass} />
                </Field>
                <Field label="Delivery estimate" hint="Shown at checkout under shipping.">
                  <input value={form.estimatedDelivery} onChange={(e) => set("estimatedDelivery", e.target.value)} className={fieldClass} />
                </Field>
              </div>
            </AdminCard>
          ) : null}

          {section === "payments" ? (
            <AdminCard className="p-6">
              <h2 className="text-2xl">Payments</h2>
              <p className="mt-1 text-sm text-ink/55">Master switch pauses checkout. Method toggles hide COD or Pay Online.</p>
              <div className="mt-5 space-y-3">
                <Toggle
                  checked={form.paymentsEnabled}
                  onChange={(v) => set("paymentsEnabled", v)}
                  label="Checkout enabled"
                  hint="Off: customers can browse, but cannot place orders."
                />
                <Toggle
                  checked={form.onlinePaymentsEnabled}
                  onChange={(v) => set("onlinePaymentsEnabled", v)}
                  label="Pay online (Razorpay)"
                  hint="Still needs valid Razorpay test/live keys in the server env."
                />
                <Toggle
                  checked={form.codEnabled}
                  onChange={(v) => set("codEnabled", v)}
                  label="Cash on delivery"
                />
                <Field label="Minimum order (₹)" hint="0 means no minimum. Checked at checkout.">
                  <input type="number" min={0} value={form.minOrderAmount} onChange={(e) => set("minOrderAmount", Number(e.target.value) || 0)} className={fieldClass} />
                </Field>
              </div>
            </AdminCard>
          ) : null}

          {section === "inventory" ? (
            <AdminCard className="p-6">
              <h2 className="text-2xl">Inventory</h2>
              <p className="mt-1 text-sm text-ink/55">Default low-stock flag for products that do not set their own threshold.</p>
              <div className="mt-5 max-w-xs">
                <Field label="Default low-stock threshold">
                  <input type="number" min={0} value={form.lowStockThreshold} onChange={(e) => set("lowStockThreshold", Number(e.target.value) || 0)} className={fieldClass} />
                </Field>
              </div>
            </AdminCard>
          ) : null}

          {section === "social" ? (
            <AdminCard className="p-6">
              <h2 className="text-2xl">Social</h2>
              <p className="mt-1 text-sm text-ink/55">Icons appear in the footer only when a URL is filled.</p>
              <div className="mt-5 space-y-4">
                <Field label="Instagram URL">
                  <input value={form.instagramUrl} onChange={(e) => set("instagramUrl", e.target.value)} placeholder="https://instagram.com/..." className={fieldClass} />
                </Field>
                <Field label="YouTube URL">
                  <input value={form.youtubeUrl} onChange={(e) => set("youtubeUrl", e.target.value)} placeholder="https://youtube.com/..." className={fieldClass} />
                </Field>
                <Field label="Facebook URL">
                  <input value={form.facebookUrl} onChange={(e) => set("facebookUrl", e.target.value)} placeholder="https://facebook.com/..." className={fieldClass} />
                </Field>
                <Toggle
                  checked={form.newsletterEnabled}
                  onChange={(v) => set("newsletterEnabled", v)}
                  label="Footer newsletter"
                  hint="Shows the email capture under Support."
                />
              </div>
            </AdminCard>
          ) : null}

          {section === "store" ? (
            <AdminCard className="p-6">
              <h2 className="text-2xl">Store status</h2>
              <p className="mt-1 text-sm text-ink/55">Maintenance hides the shop for visitors. Admin stays available.</p>
              <div className="mt-5 space-y-4">
                <Toggle
                  checked={form.maintenanceMode}
                  onChange={(v) => set("maintenanceMode", v)}
                  label="Maintenance mode"
                  hint="Replaces the storefront with a pause screen. Staff can still sign in."
                />
                <Field label="Maintenance message">
                  <textarea
                    value={form.maintenanceMessage}
                    onChange={(e) => set("maintenanceMessage", e.target.value)}
                    rows={3}
                    className={inputClass}
                  />
                </Field>
              </div>
            </AdminCard>
          ) : null}

          <div className="flex items-center justify-end gap-3">
            {dirty ? <p className="text-[12px] text-ink/50">Unsaved changes</p> : null}
            <GoldButton size="sm" type="button" loading={pending} disabled={!dirty} onClick={() => void save()}>
              {pending ? "Saving" : "Save"}
            </GoldButton>
          </div>
        </div>
      </div>
    </div>
  )
}
