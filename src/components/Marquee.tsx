"use client"

import { Sparkle } from "lucide-react"

export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items]
  return (
    <div className="overflow-hidden border-y border-sage-200 bg-sage-50">
      <div className="marquee-track flex w-max items-center gap-8 py-4">
        {row.map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center gap-8 font-display text-xl text-sage-800 italic md:text-2xl">
            {item}
            <Sparkle size={14} className="fill-gold-bright text-gold-bright" />
          </span>
        ))}
      </div>
    </div>
  )
}
