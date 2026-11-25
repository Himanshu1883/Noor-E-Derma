"use client"

import { MapPin, Plus } from "lucide-react"
import { useState, type FormEvent } from "react"
import { toast } from "sonner"
import { AccountCard, fieldClass } from "@/components/account/ui"
import { GoldButton } from "@/components/GoldButton"
import { useAuth } from "@/context/AuthContext"
import { api } from "@/lib/client"

export default function AddressesPage() {
  const { user, refresh } = useAuth()
  const [pending, setPending] = useState(false)
  const [open, setOpen] = useState(false)

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formEl = e.currentTarget
    const form = new FormData(formEl)
    setPending(true)
    try {
      await api("/api/account/addresses", {
        method: "POST",
        body: JSON.stringify({
          name: form.get("name"),
          phone: form.get("phone"),
          line1: form.get("line1"),
          line2: form.get("line2"),
          city: form.get("city"),
          state: form.get("state"),
          pincode: form.get("pincode"),
          isDefault: form.get("isDefault") === "on" || !(user?.addresses.length),
        }),
      })
      await refresh()
      toast.success("Address saved")
      formEl.reset()
      setOpen(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save address")
    } finally {
      setPending(false)
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Account</p>
          <h1 className="mt-2 text-4xl md:text-5xl">Addresses</h1>
          <p className="mt-2 text-sm text-ink/55">Saved places for checkout. Mark one as default.</p>
        </div>
        <GoldButton className="px-5 py-2.5 text-[12px]" onClick={() => setOpen((v) => !v)}>
          <Plus size={14} /> Add Address
        </GoldButton>
      </div>

      {open ? (
        <form onSubmit={onSubmit} className="mt-6 grid gap-3 rounded-[22px] bg-white p-5 ring-1 ring-sage-100 sm:grid-cols-2">
          <input name="name" required placeholder="Full name" className={fieldClass} />
          <input name="phone" required placeholder="Phone" className={fieldClass} />
          <input name="line1" required placeholder="Address line 1" className={`sm:col-span-2 ${fieldClass}`} />
          <input name="line2" placeholder="Address line 2" className={`sm:col-span-2 ${fieldClass}`} />
          <input name="city" required placeholder="City" className={fieldClass} />
          <input name="state" required placeholder="State" className={fieldClass} />
          <input name="pincode" required placeholder="PIN code" className={fieldClass} />
          <label className="flex items-center gap-2 text-sm text-ink/60">
            <input type="checkbox" name="isDefault" className="h-4 w-4" defaultChecked /> Default address
          </label>
          <div className="sm:col-span-2">
            <GoldButton type="submit" size="sm" loading={pending}>
              {pending ? "Saving" : "Save address"}
            </GoldButton>
          </div>
        </form>
      ) : null}

      <ul className="mt-6 grid gap-4 md:grid-cols-2">
        {user?.addresses.map((a) => (
          <li key={a._id}>
            <AccountCard>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-gold-deep" />
                  <p className="font-medium">{a.label || "Home"}</p>
                </div>
                {a.isDefault ? (
                  <span className="rounded-full bg-[#faf6ec] px-2.5 py-1 text-[10px] font-medium tracking-wide text-gold-deep uppercase">
                    Default
                  </span>
                ) : null}
              </div>
              <p className="mt-3 text-sm font-medium">{a.name}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink/60">
                {a.line1}
                {a.line2 ? `, ${a.line2}` : ""}
                <br />
                {a.city}, {a.state} – {a.pincode}
              </p>
              <p className="mt-2 text-[12px] text-ink/50">{a.phone}</p>
              <button
                type="button"
                className="mt-4 text-[12px] text-ink/45 underline-offset-2 hover:text-red-800 hover:underline"
                onClick={async () => {
                  await api(`/api/account/addresses?id=${a._id}`, { method: "DELETE" })
                  await refresh()
                  toast.success("Address removed")
                }}
              >
                Remove
              </button>
            </AccountCard>
          </li>
        ))}
      </ul>
      {!user?.addresses.length && !open ? (
        <p className="mt-8 text-sm text-ink/50">No addresses yet. Add one for faster checkout.</p>
      ) : null}
    </div>
  )
}
