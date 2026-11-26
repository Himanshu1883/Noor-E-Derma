"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Plus } from "lucide-react"
import { useState } from "react"
import { Bubbles } from "@/components/Bubbles"
import { Molecule } from "@/components/Molecule"
import { ingredients, type Ingredient } from "@/data/ingredients"
import { cn } from "@/lib/cn"

const layout: Record<string, string> = {
  niacinamide: "md:col-span-2 md:row-span-2",
  bha: "md:col-span-2",
  glutathione: "",
  kojic: "",
  "vitamin-e": "md:col-span-2",
  aloe: "md:col-span-2",
}

function Burst({ seed }: { seed: number }) {
  return (
    <span className="pointer-events-none absolute inset-0" aria-hidden>
      {Array.from({ length: 9 }).map((_, i) => {
        const angle = (i / 9) * Math.PI * 2 + seed
        const dist = 60 + (i % 3) * 22
        return (
          <motion.span
            key={`${seed}-${i}`}
            className="absolute top-1/2 left-1/2 rounded-full border border-white bg-sage-100/70"
            style={{ width: 6 + (i % 3) * 4, height: 6 + (i % 3) * 4 }}
            initial={{ x: 0, y: 0, opacity: 0.9, scale: 0.4 }}
            animate={{ x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, opacity: 0, scale: 1 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          />
        )
      })}
    </span>
  )
}

function IngredientCard({ item, open, onToggle, big }: { item: Ingredient; open: boolean; onToggle: () => void; big: boolean }) {
  const [seed, setSeed] = useState(0)
  return (
    <motion.button
      type="button"
      layout
      onClick={onToggle}
      onMouseEnter={() => setSeed((s) => s + 1)}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      className={cn(
        "group glass relative flex flex-col overflow-hidden rounded-[32px] p-6 text-left transition-shadow hover:shadow-[0_0_0_1.5px_rgb(var(--bubble)/0.6),0_24px_50px_-24px_rgb(var(--tint)/0.4)]",
        layout[item.id],
      )}
    >
      <div
        className={cn(
          "relative flex items-center justify-center rounded-3xl bg-[radial-gradient(circle_at_50%_40%,#fff,var(--t-50)_70%)]",
          big ? "h-56 md:min-h-72 md:flex-1" : "h-40",
        )}
      >
        {seed > 0 ? <Burst seed={seed} /> : null}
        <Molecule kind={item.id} className={big ? "w-64 md:w-80" : "w-44"} />
      </div>
      <div className="mt-5 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium tracking-wide text-sage-600">{item.aka}</p>
          <h3 className={cn("mt-1 font-medium", big ? "text-4xl" : "text-2xl")}>{item.name}</h3>
          <p className="mt-1.5 text-[15px] text-ink/65">{item.benefit}</p>
        </div>
        <span className={cn("mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition", open ? "rotate-45 gold-fill text-white" : "bg-sage-50 text-sage-800")}>
          <Plus size={16} />
        </span>
      </div>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <p className="pt-3 text-[14px] leading-relaxed text-ink/70">{item.detail}</p>
            <div className="mt-3 flex min-w-0 flex-wrap gap-2">
              {item.foundIn.map((f) => (
                <span key={f} className="rounded-full bg-sage-800 px-3 py-1 text-[11px] font-medium text-white">
                  Found in {f}
                </span>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.button>
  )
}

export function Ingredients() {
  const [open, setOpen] = useState<string | null>("niacinamide")

  return (
    <section id="ingredients" className="relative overflow-hidden bg-ivory py-20 md:py-28">
      <Bubbles count={10} />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-6 md:grid-cols-2 md:items-end">
          <div>
            <p className="eyebrow">Clean science</p>
            <h2 className="mt-3 text-[clamp(2.2rem,4.5vw,3.8rem)] leading-none font-medium">
              Six actives. <span className="gold-text italic">Zero</span> mystery.
            </h2>
          </div>
          <p className="max-w-md text-ink/60 md:justify-self-end">
            Every active below is printed on our packs. Tap a molecule to see what it is and where you&apos;ll find it.
          </p>
        </div>
        <div className="mt-10 grid auto-rows-auto gap-4 md:grid-cols-4">
          {ingredients.map((item) => (
            <IngredientCard
              key={item.id}
              item={item}
              big={item.id === "niacinamide"}
              open={open === item.id}
              onToggle={() => setOpen(open === item.id ? null : item.id)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
