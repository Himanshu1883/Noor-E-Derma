"use client"

import { useState, type FormEvent } from "react"
import { toast } from "sonner"
import { GoldButton } from "@/components/GoldButton"
import { api } from "@/lib/client"

export function ContactForm() {
  const [pending, setPending] = useState(false)
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    setPending(true)
    try {
      const data = await api<{ message: string }>("/api/contact", {
        method: "POST",
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          phone: form.get("phone"),
          comment: form.get("comment"),
        }),
      })
      toast.success(data.message)
      e.currentTarget.reset()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send")
    } finally {
      setPending(false)
    }
  }
  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-3">
      <input name="name" required placeholder="Your name" className="w-full rounded-full bg-white/80 px-4 py-3 text-sm ring-1 ring-sage-100" />
      <input name="email" type="email" required placeholder="you@email.com" className="w-full rounded-full bg-white/80 px-4 py-3 text-sm ring-1 ring-sage-100" />
      <input name="phone" required placeholder="Phone" className="w-full rounded-full bg-white/80 px-4 py-3 text-sm ring-1 ring-sage-100" />
      <textarea name="comment" required rows={5} placeholder="How can we help?" className="w-full rounded-2xl bg-white/80 px-4 py-3 text-sm ring-1 ring-sage-100" />
      <GoldButton type="submit">{pending ? "Sending…" : "Send message"}</GoldButton>
    </form>
  )
}
