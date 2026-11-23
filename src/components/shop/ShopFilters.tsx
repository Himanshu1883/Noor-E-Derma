"use client"

import { SlidersHorizontal, X } from "lucide-react"
import Link from "next/link"
import { collections, type Collection } from "@/data/collections"
import { cn } from "@/lib/cn"
import { SORT_OPTIONS, type ShopSort } from "@/lib/shop"

const COLLECTION_LABEL: Record<string, string> = {
  tan: "Tan care",
  detox: "Daily detox",
  combos: "Combos",
}

function RadioRow({
  checked,
  onChange,
  label,
  name,
}: {
  checked: boolean
  onChange: () => void
  label: string
  name: string
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-0.5 py-1.5 text-[13px] text-ink/75 hover:text-ink">
      <input type="radio" name={name} checked={checked} onChange={onChange} className="sr-only" />
      <span
        className={cn(
          "grid h-3.5 w-3.5 shrink-0 place-items-center rounded-full ring-1",
          checked ? "ring-gold-deep" : "bg-white/80 ring-sage-200",
        )}
      >
        {checked ? <span className="h-1.5 w-1.5 rounded-full gold-fill" /> : null}
      </span>
      {label}
    </label>
  )
}

export function ShopFilters({
  collection,
  sort,
  onSort,
  onClose,
}: {
  collection?: Collection
  sort: ShopSort
  onSort: (sort: ShopSort) => void
  onClose?: () => void
}) {
  return (
    <div className="glass rounded-[24px] p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] font-medium tracking-[0.22em] text-ink/45 uppercase">Filters</p>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full bg-white/70 ring-1 ring-sage-100 lg:hidden"
            aria-label="Close filters"
          >
            <X size={14} />
          </button>
        ) : null}
      </div>

      <p className="mt-5 text-[11px] font-medium tracking-[0.18em] text-ink/40 uppercase">Sort</p>
      <div className="mt-1.5">
        {SORT_OPTIONS.map((option) => (
          <RadioRow
            key={option.id}
            name="shop-sort"
            checked={sort === option.id}
            onChange={() => onSort(option.id)}
            label={option.label}
          />
        ))}
      </div>

      <p className="mt-5 text-[11px] font-medium tracking-[0.18em] text-ink/40 uppercase">Category</p>
      <nav className="mt-1.5 flex flex-col">
        <Link
          href="/shop"
          onClick={onClose}
          className={cn("rounded-lg py-1.5 text-[13px]", !collection ? "text-ink" : "text-ink/60 hover:text-ink")}
        >
          All
        </Link>
        {collections.map((c) => (
          <Link
            key={c.slug}
            href={`/shop/${c.slug}`}
            onClick={onClose}
            className={cn(
              "rounded-lg py-1.5 text-[13px]",
              collection?.slug === c.slug ? "text-ink" : "text-ink/60 hover:text-ink",
            )}
          >
            {COLLECTION_LABEL[c.slug] ?? c.title}
          </Link>
        ))}
      </nav>
    </div>
  )
}

export function ShopFilterBar({
  sort,
  onSort,
  onOpen,
}: {
  sort: ShopSort
  onSort: (sort: ShopSort) => void
  onOpen: () => void
}) {
  return (
    <div className="mb-5 flex items-center justify-between gap-3 lg:hidden">
      <button
        type="button"
        onClick={onOpen}
        className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3.5 py-2 text-[13px] ring-1 ring-sage-100"
      >
        <SlidersHorizontal size={15} />
        Filters
      </button>
      <select
        value={sort}
        onChange={(e) => onSort(e.target.value as ShopSort)}
        className="rounded-full bg-white/70 py-2 pr-7 pl-3 text-[13px] text-ink outline-none ring-1 ring-sage-100"
        aria-label="Sort products"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
