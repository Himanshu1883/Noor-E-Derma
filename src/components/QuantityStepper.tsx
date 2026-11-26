"use client"

import { Minus, Plus } from "lucide-react"

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 8,
}: {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
}) {
  return (
    <div className="inline-flex shrink-0 items-center rounded-full border border-sage-200 bg-white">
      <button
        type="button"
        disabled={value <= min}
        className="rounded-full p-2.5 text-sage-800 transition hover:bg-sage-50 disabled:opacity-30"
        onClick={() => onChange(Math.max(min, value - 1))}
        aria-label="Decrease quantity"
      >
        <Minus size={14} />
      </button>
      <span className="min-w-8 text-center text-sm font-medium tabular-nums">{value}</span>
      <button
        type="button"
        disabled={value >= max}
        className="rounded-full p-2.5 text-sage-800 transition hover:bg-sage-50 disabled:opacity-30"
        onClick={() => onChange(Math.min(max, value + 1))}
        aria-label="Increase quantity"
      >
        <Plus size={14} />
      </button>
    </div>
  )
}
