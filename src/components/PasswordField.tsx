"use client"

import { useState } from "react"
import { cn } from "@/lib/cn"

function EyeOpen() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
      <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeShut() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
      <path d="M3 3l18 18" />
      <path d="M10.6 10.6A3 3 0 0 0 12 15a3 3 0 0 0 2.4-4.4" />
      <path d="M9.9 5.2A11.4 11.4 0 0 1 12 5c6 0 9.5 7 9.5 7a16.7 16.7 0 0 1-3.2 4.1" />
      <path d="M6.5 6.6C4.2 8.3 2.5 12 2.5 12s3.5 7 9.5 7c1.3 0 2.5-.2 3.6-.6" />
    </svg>
  )
}

export function PasswordField({
  name,
  label,
  placeholder,
  autoComplete,
  className,
  minLength,
  required = true,
}: {
  name: string
  label?: string
  placeholder?: string
  autoComplete?: string
  className?: string
  minLength?: number
  required?: boolean
}) {
  const [show, setShow] = useState(false)
  return (
    <label className="block">
      {label ? <span className="mb-1.5 block text-[12px] tracking-[0.16em] text-ink/50 uppercase">{label}</span> : null}
      <span className="relative block">
        <input
          name={name}
          type={show ? "text" : "password"}
          required={required}
          minLength={minLength}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className={cn("w-full pr-12", className)}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="absolute top-1/2 right-3 -translate-y-1/2 text-ink/40 transition hover:text-ink"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeShut /> : <EyeOpen />}
        </button>
      </span>
    </label>
  )
}
