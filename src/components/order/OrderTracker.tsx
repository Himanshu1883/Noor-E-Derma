"use client"

import { Check } from "lucide-react"
import { StatusChip } from "@/components/account/ui"
import { cn } from "@/lib/cn"
import { formatINR } from "@/lib/format"

export type TrackPayload = {
  orderNumber: string
  status: string
  paymentStatus: string
  paymentMethod?: string
  trackingNumber?: string
  carrier?: string
  trackingUrl?: string
  total: number
  subtotal?: number
  discount?: number
  shippingFee?: number
  createdAt?: string
  shipping?: {
    name?: string
    phone?: string
    line1?: string
    line2?: string
    city?: string
    state?: string
    pincode?: string
  }
  lines?: { name?: string; quantity?: number; price?: number; image?: string }[]
  cancelled?: boolean
  steps: { key: string; label: string; done: boolean; current: boolean; at?: string }[]
  events: { key: string; title: string; detail: string; at?: string }[]
}

function stamp(iso?: string) {
  if (!iso) return "—"
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso))
}

export function OrderTracker({
  track,
  tab,
  onTab,
}: {
  track: TrackPayload
  tab: "details" | "track"
  onTab: (tab: "details" | "track") => void
}) {
  const current = track.events.find((e) => e.key === track.steps.find((s) => s.current)?.key) ?? track.events.at(-1)

  return (
    <div className="overflow-hidden rounded-[1.75rem] bg-white ring-1 ring-sage-100">
      <div className="flex items-center justify-between gap-3 border-b border-sage-50 px-5 py-4 md:px-6">
        <div className="min-w-0">
          <p className="text-[11px] tracking-[0.14em] text-ink/40 uppercase">Order</p>
          <p className="truncate text-lg text-ink">#{track.orderNumber}</p>
        </div>
        <StatusChip status={track.status} />
      </div>

      <div className="flex gap-1 px-5 pt-3 md:px-6">
        {(
          [
            ["track", "Track"],
            ["details", "Details"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => onTab(id)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-[12px] font-medium transition",
              tab === id ? "bg-sage-50 text-sage-800 ring-1 ring-sage-100" : "text-ink/50 hover:text-ink",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "track" ? (
        <div className="px-5 py-6 md:px-6 md:py-8">
          {track.cancelled ? (
            <p className="text-center text-sm text-red-700">This order was cancelled or refunded.</p>
          ) : (
            <>
              <ol className="mx-auto flex max-w-2xl items-start">
                {track.steps.map((step, i) => (
                  <li key={step.key} className="relative flex flex-1 flex-col items-center">
                    {i < track.steps.length - 1 ? (
                      <span
                        className={cn(
                          "absolute top-[13px] left-1/2 h-px w-full",
                          track.steps[i + 1]?.done ? "bg-gold-deep/70" : "bg-sage-100",
                        )}
                      />
                    ) : null}
                    <span
                      className={cn(
                        "relative z-[1] grid h-[26px] w-[26px] place-items-center rounded-full ring-4 ring-white",
                        step.done ? "gold-fill text-white" : "bg-sage-100 text-ink/30",
                      )}
                    >
                      <Check size={13} strokeWidth={3} />
                    </span>
                    <p className={cn("mt-2 text-center text-[11px]", step.current ? "font-medium text-ink" : "text-ink/45")}>
                      {step.label}
                    </p>
                  </li>
                ))}
              </ol>

              {current ? (
                <p className="mt-6 text-center text-sm text-ink/65">{current.detail}</p>
              ) : null}

              <ul className="mt-8 space-y-0 border-t border-sage-50">
                {track.events.map((event) => (
                  <li key={event.key} className="grid gap-1 border-b border-sage-50 py-3.5 text-sm md:grid-cols-[7.5rem_1fr_auto] md:items-baseline md:gap-4">
                    <span className="font-medium text-ink">{event.title}</span>
                    <span className="text-ink/55">{event.detail}</span>
                    <span className="text-[12px] text-ink/40 md:text-right">{stamp(event.at)}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      ) : (
        <div className="grid gap-8 px-5 py-6 md:grid-cols-2 md:px-6 md:py-7">
          <div>
            <p className="text-[11px] tracking-[0.14em] text-ink/40 uppercase">Items</p>
            <ul className="mt-3 divide-y divide-sage-50">
              {(track.lines ?? []).map((line, i) => (
                <li key={i} className="flex items-center gap-3 py-3 first:pt-0">
                  <span className="h-12 w-12 overflow-hidden rounded-xl bg-peach">
                    {line.image ? <img src={line.image} alt="" className="h-full w-full object-cover" /> : null}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{line.name}</p>
                    <p className="text-[12px] text-ink/45">Qty {line.quantity}</p>
                  </div>
                  <p className="text-sm font-medium">{formatINR((line.price ?? 0) * (line.quantity ?? 1))}</p>
                </li>
              ))}
            </ul>
            <dl className="mt-3 space-y-1.5 border-t border-sage-50 pt-3 text-sm">
              {track.subtotal != null ? (
                <div className="flex justify-between text-ink/55">
                  <dt>Subtotal</dt>
                  <dd>{formatINR(track.subtotal)}</dd>
                </div>
              ) : null}
              {(track.discount ?? 0) > 0 ? (
                <div className="flex justify-between text-sage-700">
                  <dt>Discount</dt>
                  <dd>−{formatINR(track.discount ?? 0)}</dd>
                </div>
              ) : null}
              <div className="flex justify-between font-medium">
                <dt>Total</dt>
                <dd>{formatINR(track.total)}</dd>
              </div>
            </dl>
          </div>
          <div className="space-y-5">
            <div>
              <p className="text-[11px] tracking-[0.14em] text-ink/40 uppercase">Delivery</p>
              {track.shipping ? (
                <p className="mt-2 text-sm leading-relaxed text-ink/65">
                  {track.shipping.name}
                  <br />
                  {track.shipping.line1}
                  {track.shipping.line2 ? (
                    <>
                      <br />
                      {track.shipping.line2}
                    </>
                  ) : null}
                  <br />
                  {track.shipping.city}, {track.shipping.state} {track.shipping.pincode}
                </p>
              ) : (
                <p className="mt-2 text-sm text-ink/45">No shipping details.</p>
              )}
            </div>
            <div>
              <p className="text-[11px] tracking-[0.14em] text-ink/40 uppercase">Payment</p>
              <p className="mt-2 text-sm text-ink/65">
                {track.paymentMethod === "cod" ? "Cash on Delivery" : "Paid online"} · {track.paymentStatus}
              </p>
            </div>
            {track.trackingNumber ? (
              <div>
                <p className="text-[11px] tracking-[0.14em] text-ink/40 uppercase">Courier</p>
                <p className="mt-2 text-sm text-ink/65">
                  {track.carrier} {track.trackingNumber}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}
