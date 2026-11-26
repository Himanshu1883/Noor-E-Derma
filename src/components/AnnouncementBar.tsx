"use client"

import Link from "next/link"
import { useStoreSettings } from "@/context/StoreSettingsContext"

export function AnnouncementBar() {
  const { announcement, announcementEnabled, announcementLink } = useStoreSettings()
  const text = announcement.trim()
  if (!announcementEnabled || !text) return null

  const inner = <span className="block truncate px-4 py-2 text-center text-[12px] font-medium tracking-[0.04em] text-ivory">{text}</span>
  const className = "fixed inset-x-0 top-0 z-[51] bg-sage-800"

  if (announcementLink.trim()) {
    const href = announcementLink.trim()
    const external = href.startsWith("http")
    if (external) {
      return (
        <a href={href} target="_blank" rel="noreferrer" className={className}>
          {inner}
        </a>
      )
    }
    return (
      <Link href={href} className={className}>
        {inner}
      </Link>
    )
  }

  return <div className={className}>{inner}</div>
}

export function useAnnouncementOffset() {
  const { announcement, announcementEnabled } = useStoreSettings()
  return announcementEnabled && announcement.trim() ? 36 : 0
}
