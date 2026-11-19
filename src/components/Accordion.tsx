import { AnimatePresence, motion } from "framer-motion"
import { Plus } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/cn"

export function Accordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <div
            key={item.q}
            className={cn(
              "rounded-3xl border px-6 py-4 transition",
              isOpen ? "border-sage-200 bg-white shadow-[0_16px_40px_-24px_rgba(58,81,48,0.35)]" : "border-sage-100 bg-white/60",
            )}
          >
            <button
              type="button"
              className="flex w-full items-center justify-between gap-6 text-left"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
            >
              <span className="font-display text-lg text-ink md:text-xl">{item.q}</span>
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition",
                  isOpen ? "rotate-45 gold-fill text-white" : "bg-sage-50 text-sage-800",
                )}
              >
                <Plus size={16} />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.p
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden pt-2 pr-10 text-[15px] leading-relaxed text-ink/70"
                >
                  {item.a}
                </motion.p>
              ) : null}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
