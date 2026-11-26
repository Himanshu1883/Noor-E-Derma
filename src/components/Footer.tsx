"use client"

import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useState, type FormEvent } from "react"
import { ASSETS } from "@/data/config"
import { FOOTER_COMPANY, FOOTER_POLICIES, FOOTER_SHOP, FOOTER_SUPPORT } from "@/data/site"
import { useStoreSettings } from "@/context/StoreSettingsContext"

function Col({ title, links }: { title: string; links: readonly { label: string; href: string }[] }) {
  return (
    <div>
      <p className="text-xs font-medium tracking-[0.2em] text-gold-bright uppercase">{title}</p>
      <ul className="mt-4 space-y-2.5 text-[15px] font-medium text-white/75">
        {links.map((l) => (
          <li key={l.href}>
            <Link className="hover:text-white" href={l.href}>
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Footer() {
  const store = useStoreSettings()
  const [note, setNote] = useState("")
  const socials = [
    { label: "Instagram", href: store.instagramUrl },
    { label: "YouTube", href: store.youtubeUrl },
    { label: "Facebook", href: store.facebookUrl },
  ].filter((s) => s.href.trim())
  const payMarks = [
    store.onlinePaymentsEnabled ? "UPI" : null,
    store.onlinePaymentsEnabled ? "Visa" : null,
    store.onlinePaymentsEnabled ? "Mastercard" : null,
    store.onlinePaymentsEnabled ? "RuPay" : null,
    store.codEnabled ? "COD" : null,
  ].filter((p): p is string => Boolean(p))

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setNote("Thanks, you're on the list.")
  }

  return (
    <footer className="min-w-0 max-w-full overflow-x-clip bg-sage-800 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 pt-16 pb-10 md:grid-cols-12 md:px-8">
        <div className="md:col-span-4">
          <div className="inline-flex rounded-3xl bg-ivory px-5 py-3">
            <img src={ASSETS.logo} alt={store.storeName} className="h-14 w-auto" />
          </div>
          <p className="font-highlight mt-5 max-w-xs text-xl text-white/90">{store.tagline}</p>
          {store.footerNote ? <p className="mt-3 max-w-xs text-sm text-white/60">{store.footerNote}</p> : null}
          <a href={`mailto:${store.supportEmail}`} className="mt-3 inline-block text-sm text-gold-bright hover:text-white">
            {store.supportEmail}
          </a>
          {socials.length ? (
            <div className="mt-4 flex flex-wrap gap-3 text-[13px] text-white/70">
              {socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="hover:text-white">
                  {s.label}
                </a>
              ))}
            </div>
          ) : null}
        </div>
        <div className="md:col-span-2">
          <Col title="Shop" links={FOOTER_SHOP} />
        </div>
        <div className="md:col-span-2">
          <Col title="Company" links={FOOTER_COMPANY} />
        </div>
        <div className="md:col-span-4">
          <Col title="Support" links={FOOTER_SUPPORT} />
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-white/55">
            {FOOTER_POLICIES.map((l) => (
              <li key={l.href}>
                <Link className="hover:text-white" href={l.href}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          {store.newsletterEnabled ? (
            <form onSubmit={onSubmit} className="mt-5 flex rounded-full bg-white/10 p-1.5 ring-1 ring-white/15">
              <input
                type="email"
                required
                placeholder="Your email"
                className="w-full bg-transparent px-4 text-sm text-white outline-none placeholder:text-white/45"
              />
              <button type="submit" aria-label="Subscribe" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full gold-fill">
                <ArrowRight size={16} />
              </button>
            </form>
          ) : null}
          {note ? <p className="mt-2 text-xs text-gold-bright">{note}</p> : null}
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-5 text-xs text-white/55 md:flex-row md:items-center md:justify-between md:px-8">
          <p>
            © {new Date().getFullYear()} {store.legalName}. All rights reserved.
            {store.gst ? ` · GSTIN ${store.gst}` : ""}
          </p>
          {payMarks.length ? (
            <div className="flex flex-wrap gap-2">
              {payMarks.map((p) => (
                <span key={p} className="rounded-md bg-white/10 px-2 py-1">
                  {p}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </footer>
  )
}
