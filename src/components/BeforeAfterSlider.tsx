"use client"

import { MoveHorizontal } from "lucide-react"
import { useRef, useState } from "react"

export function BeforeAfterSlider() {
  const [pos, setPos] = useState(50)
  const dragging = useRef(false)

  const update = (clientX: number, el: HTMLDivElement) => {
    const r = el.getBoundingClientRect()
    setPos(Math.min(96, Math.max(4, ((clientX - r.left) / r.width) * 100)))
  }

  return (
    <div
      className="relative aspect-[4/3] w-full cursor-ew-resize touch-none overflow-hidden rounded-[32px] select-none"
      onPointerDown={(e) => {
        dragging.current = true
        e.currentTarget.setPointerCapture(e.pointerId)
        update(e.clientX, e.currentTarget)
      }}
      onPointerMove={(e) => dragging.current && update(e.clientX, e.currentTarget)}
      onPointerUp={() => (dragging.current = false)}
    >
      <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_40%_40%,#c9a47c,#9c7650_60%,#7d5c3e)]" />
      <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_30%,#5c4129_1px,transparent_2px),radial-gradient(circle_at_70%_60%,#5c4129_1px,transparent_2px)] [background-size:18px_18px,26px_26px]" />
      <div
        className="absolute inset-0 bg-[radial-gradient(60%_60%_at_40%_40%,#fff3e2,#f4d9bb_60%,#e9c39d)]"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(30%_25%_at_35%_30%,rgba(255,255,255,0.75),transparent)]" />
      </div>
      <span className="glass absolute top-4 left-4 rounded-full px-3 py-1 text-xs font-medium">After · Illustrative</span>
      <span className="absolute top-4 right-4 rounded-full bg-black/25 px-3 py-1 text-xs font-medium text-white backdrop-blur">Before · Illustrative</span>
      <div className="absolute inset-y-0 w-0.5 bg-white" style={{ left: `${pos}%` }}>
        <span className="absolute top-1/2 left-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full gold-fill text-white shadow-xl ring-4 ring-white/70">
          <MoveHorizontal size={18} />
        </span>
      </div>
    </div>
  )
}
