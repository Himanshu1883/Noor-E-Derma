"use client"

import { useState, type FormEvent } from "react"
import { GoldButton } from "@/components/GoldButton"
import { cn } from "@/lib/cn"

export type Field = {
  name: string
  label: string
  type?: "text" | "email" | "tel" | "textarea"
  placeholder?: string
  required?: boolean
}

export function DraftForm({
  fields,
  submitLabel,
  success,
  className,
}: {
  fields: Field[]
  submitLabel: string
  success: string
  className?: string
}) {
  const [note, setNote] = useState("")

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setNote(success)
  }

  return (
    <form onSubmit={onSubmit} className={cn("space-y-3", className)}>
      {fields.map((f) => (
        <label key={f.name} className="block">
          <span className="mb-1.5 block text-[12px] tracking-[0.16em] text-ink/50 uppercase">{f.label}</span>
          {f.type === "textarea" ? (
            <textarea
              name={f.name}
              required={f.required}
              placeholder={f.placeholder}
              rows={5}
              className="w-full rounded-2xl bg-white/80 px-4 py-3 text-sm outline-none ring-1 ring-sage-100 focus:ring-gold/50"
            />
          ) : (
            <input
              name={f.name}
              type={f.type ?? "text"}
              required={f.required}
              placeholder={f.placeholder}
              className="w-full rounded-full bg-white/80 px-4 py-3 text-sm outline-none ring-1 ring-sage-100 focus:ring-gold/50"
            />
          )}
        </label>
      ))}
      <GoldButton type="submit" className="mt-2 w-full py-3.5 sm:w-auto">
        {submitLabel}
      </GoldButton>
      {note ? <p className="text-sm text-sage-600">{note}</p> : null}
      <p className="text-[11px] text-ink/40">Frontend only for now — submissions are not stored. Backend comes next.</p>
    </form>
  )
}
