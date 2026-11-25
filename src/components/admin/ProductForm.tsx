"use client"

import { ImagePlus, Plus, Star, Trash2 } from "lucide-react"
import { useMemo, useRef, useState, type ReactNode } from "react"
import { toast } from "sonner"
import { BusyOverlay } from "@/components/Busy"
import { GoldButton } from "@/components/GoldButton"
import { hintClass, inputClass, labelClass } from "@/components/admin/ui"
import { api } from "@/lib/client"
import { cn } from "@/lib/cn"

export type AdminProductImage = {
  src: string
  alt?: string
  type?: "image" | "video"
  fileId?: string
  poster?: string
}

export type AdminProduct = {
  _id?: string
  name: string
  slug: string
  sku: string
  price: number
  compareAt?: number
  stock: number
  active?: boolean
  tagline?: string
  displayName?: string
  description?: string
  cardLine?: string
  netWeight?: string
  ctaLabel?: string
  lowStockThreshold?: number
  badges?: string[]
  images?: AdminProductImage[]
  customFields?: { label?: string; value?: string }[]
}

type ExtraKey = "tagline" | "displayName" | "compareAt" | "netWeight" | "cardLine" | "ctaLabel" | "lowStockThreshold" | "badges"

const EXTRA_FIELDS: { key: ExtraKey; label: string }[] = [
  { key: "tagline", label: "Tagline" },
  { key: "displayName", label: "Display name" },
  { key: "compareAt", label: "Compare-at price" },
  { key: "netWeight", label: "Net weight" },
  { key: "cardLine", label: "Card line" },
  { key: "ctaLabel", label: "Button label" },
  { key: "lowStockThreshold", label: "Low-stock alert" },
  { key: "badges", label: "Badges" },
]

const MAX_IMAGES = 8
const MAX_IMAGE_BYTES = 8 * 1024 * 1024
const MAX_VIDEO_BYTES = 50 * 1024 * 1024
const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"])
const VIDEO_TYPES = new Set(["video/mp4"])

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string
  hint?: string
  error?: string
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      {children}
      {error ? <span className="mt-1 block text-[12px] text-red-700">{error}</span> : hint ? <span className={hintClass}>{hint}</span> : null}
    </label>
  )
}

export function ProductForm({
  product,
  onCancel,
  onSaved,
  className,
  contained = false,
}: {
  product?: AdminProduct | null
  onCancel: () => void
  onSaved: () => Promise<void> | void
  className?: string
  contained?: boolean
}) {
  const editing = Boolean(product?._id)
  const fileRef = useRef<HTMLInputElement>(null)
  const extraBlockRef = useRef<HTMLDivElement>(null)

  const scrollToExtras = () => {
    window.setTimeout(() => extraBlockRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 60)
  }
  const [pending, setPending] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [name, setName] = useState(product?.name ?? "")
  const [slug, setSlug] = useState(product?.slug ?? "")
  const [slugLocked, setSlugLocked] = useState(Boolean(product?.slug))
  const [sku, setSku] = useState(product?.sku ?? "")
  const [price, setPrice] = useState(product?.price ? String(product.price) : "")
  const [stock, setStock] = useState(product?.stock != null ? String(product.stock) : "0")
  const [description, setDescription] = useState(product?.description ?? "")
  const [active, setActive] = useState(product?.active !== false)
  const [tagline, setTagline] = useState(product?.tagline ?? "")
  const [displayName, setDisplayName] = useState(product?.displayName ?? "")
  const [compareAt, setCompareAt] = useState(product?.compareAt ? String(product.compareAt) : "")
  const [netWeight, setNetWeight] = useState(product?.netWeight ?? "")
  const [cardLine, setCardLine] = useState(product?.cardLine ?? "")
  const [ctaLabel, setCtaLabel] = useState(product?.ctaLabel ?? "")
  const [lowStockThreshold, setLowStockThreshold] = useState(
    product?.lowStockThreshold != null ? String(product.lowStockThreshold) : "8",
  )
  const [badges, setBadges] = useState((product?.badges ?? []).join(", "))
  const [images, setImages] = useState<AdminProductImage[]>(
    (product?.images ?? []).filter((img) => img.src).map((img) => ({
      src: img.src as string,
      alt: img.alt ?? "",
      type: img.type === "video" ? "video" : "image",
      fileId: img.fileId,
      poster: img.poster,
    })),
  )
  const [customFields, setCustomFields] = useState<{ label: string; value: string }[]>(
    (product?.customFields ?? [])
      .filter((f) => f.label || f.value)
      .map((f) => ({ label: f.label ?? "", value: f.value ?? "" })),
  )
  const [openExtras, setOpenExtras] = useState<ExtraKey[]>(() => {
    const keys: ExtraKey[] = []
    if (product?.tagline) keys.push("tagline")
    if (product?.displayName) keys.push("displayName")
    if (product?.compareAt) keys.push("compareAt")
    if (product?.netWeight) keys.push("netWeight")
    if (product?.cardLine) keys.push("cardLine")
    if (product?.ctaLabel) keys.push("ctaLabel")
    if (product?.lowStockThreshold != null && product.lowStockThreshold !== 8) keys.push("lowStockThreshold")
    if (product?.badges?.length) keys.push("badges")
    return keys
  })
  const [addMenu, setAddMenu] = useState(false)

  const unusedExtras = useMemo(() => EXTRA_FIELDS.filter((f) => !openExtras.includes(f.key)), [openExtras])

  const addExtra = (key: ExtraKey) => {
    setOpenExtras((list) => (list.includes(key) ? list : [...list, key]))
    setAddMenu(false)
    scrollToExtras()
  }

  const addCustom = () => {
    setCustomFields((list) => [...list, { label: "", value: "" }])
    setAddMenu(false)
    scrollToExtras()
  }

  const setCover = (index: number) => {
    setImages((list) => {
      const next = [...list]
      const [picked] = next.splice(index, 1)
      next.unshift(picked)
      return next
    })
  }

  const validateFiles = (files: File[]) => {
    if (images.length + files.length > MAX_IMAGES) {
      throw new Error(`You can add up to ${MAX_IMAGES} images`)
    }
    for (const file of files) {
      if (IMAGE_TYPES.has(file.type)) {
        if (file.size > MAX_IMAGE_BYTES) throw new Error(`${file.name} is over 8MB`)
      } else if (VIDEO_TYPES.has(file.type)) {
        if (file.size > MAX_VIDEO_BYTES) throw new Error(`${file.name} is over 50MB`)
      } else {
        throw new Error(`${file.name} must be JPG, PNG, WEBP, GIF, or MP4`)
      }
    }
  }

  const uploadFiles = async (fileList: FileList | File[]) => {
    const files = [...fileList]
    if (!files.length) return
    try {
      validateFiles(files)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invalid file")
      return
    }
    setUploading(true)
    try {
      const uploaded: AdminProductImage[] = []
      for (const file of files) {
        const body = new FormData()
        body.append("file", file)
        const saved = await api<{ id: string; src: string }>("/api/admin/upload", { method: "POST", body })
        uploaded.push({
          src: saved.src,
          fileId: saved.id,
          alt: name || file.name,
          type: VIDEO_TYPES.has(file.type) ? "video" : "image",
        })
      }
      setImages((list) => [...list, ...uploaded])
      toast.success(uploaded.length === 1 ? "Image added" : `${uploaded.length} files added`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ""
    }
  }

  const validate = () => {
    const next: Record<string, string> = {}
    if (name.trim().length < 2) next.name = "Enter a product name"
    const cleanSlug = slugify(slug || name)
    if (!/^[a-z0-9-]{2,80}$/.test(cleanSlug)) next.slug = "Use lowercase letters, numbers, and dashes"
    if (sku.trim().length < 2) next.sku = "Enter a SKU"
    if (!Number.isInteger(Number(price)) || Number(price) <= 0) next.price = "Enter a price in rupees"
    if (!Number.isInteger(Number(stock)) || Number(stock) < 0) next.stock = "Stock cannot be negative"
    if (!images.length) next.images = "Add at least one product image"
    customFields.forEach((field, i) => {
      if ((field.label && !field.value) || (field.value && !field.label)) {
        next[`custom-${i}`] = "Fill both the field name and value"
      }
    })
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const save = async () => {
    if (!validate()) {
      toast.error("Please fix the highlighted fields")
      return
    }
    const payload = {
      name: name.trim(),
      slug: slugify(slug || name),
      sku: sku.trim().toUpperCase(),
      price: Number(price),
      stock: Number(stock),
      description: description.trim(),
      active,
      tagline: tagline.trim(),
      displayName: displayName.trim(),
      cardLine: cardLine.trim(),
      netWeight: netWeight.trim(),
      ctaLabel: ctaLabel.trim(),
      lowStockThreshold: Number(lowStockThreshold) || 8,
      badges: badges
        .split(",")
        .map((b) => b.trim())
        .filter(Boolean),
      images: images.map((img, i) => ({
        src: img.src,
        alt: img.alt || name,
        type: img.type ?? "image",
        fileId: img.fileId,
        poster: img.poster,
        position: img.position && img.position !== "front" ? img.position : undefined,
      })),
      customFields: customFields.filter((f) => f.label.trim() && f.value.trim()),
      ...(compareAt && Number(compareAt) > 0 ? { compareAt: Number(compareAt) } : {}),
    }
    setPending(true)
    try {
      if (editing && product?._id) {
        await api(`/api/admin/products/${product._id}`, { method: "PATCH", body: JSON.stringify(payload) })
        toast.success("Product updated")
      } else {
        await api("/api/admin/products", { method: "POST", body: JSON.stringify(payload) })
        toast.success("Product created")
      }
      await onSaved()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save product")
    } finally {
      setPending(false)
    }
  }

  return (
    <div
      className={cn(
        "overflow-hidden bg-white",
        contained
          ? "flex h-full min-h-0 flex-col"
          : "mt-6 rounded-[28px] ring-1 ring-sage-100",
        className,
      )}
    >
      <div className="flex shrink-0 flex-wrap items-end justify-between gap-3 border-b border-sage-50 px-5 py-5 md:px-7">
        <div>
          <p className={labelClass}>{editing ? "Edit ritual" : "New ritual"}</p>
          <h2 className="mt-1 font-display text-3xl">{editing ? product?.name : "Add product"}</h2>
        </div>
        <div className="relative">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-full bg-sage-50 px-3.5 py-2 text-[12px] text-sage-800 ring-1 ring-sage-100"
            onClick={() => setAddMenu((v) => !v)}
          >
            <Plus size={14} /> Add fields
          </button>
          {addMenu ? (
            <div className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-2xl bg-white p-1.5 shadow-xl ring-1 ring-sage-100">
              {unusedExtras.map((field) => (
                <button
                  key={field.key}
                  type="button"
                  className="block w-full rounded-xl px-3 py-2 text-left text-[13px] hover:bg-sage-50"
                  onClick={() => addExtra(field.key)}
                >
                  {field.label}
                </button>
              ))}
              <button
                type="button"
                className="block w-full rounded-xl px-3 py-2 text-left text-[13px] text-sage-800 hover:bg-sage-50"
                onClick={addCustom}
              >
                Custom field
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <div
        data-lenis-prevent={contained ? "" : undefined}
        onWheel={contained ? (e) => e.stopPropagation() : undefined}
        className={cn(
          "grid gap-8 p-5 md:p-7 xl:grid-cols-[minmax(20rem,38rem)_minmax(0,1fr)] xl:items-start",
          contained && "min-h-0 flex-1 overflow-y-scroll overscroll-contain",
        )}
      >
        <div className="max-w-[38rem] space-y-4">
          <Field label="Product name" hint="Shown on the shop and product page" error={errors.name}>
            <input
              value={name}
              onChange={(e) => {
                const next = e.target.value
                setName(next)
                if (!slugLocked) setSlug(slugify(next))
              }}
              placeholder="Daily Detox Face Wash"
              className={inputClass}
            />
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="URL slug" hint="noor-e-derma.com/product/…" error={errors.slug}>
              <input
                value={slug}
                onChange={(e) => {
                  setSlugLocked(true)
                  setSlug(slugify(e.target.value))
                }}
                placeholder="daily-detox-face-wash"
                className={inputClass}
              />
            </Field>
            <Field label="SKU" hint="Unique warehouse code" error={errors.sku}>
              <input value={sku} onChange={(e) => setSku(e.target.value.toUpperCase())} placeholder="DAILYDETOX" className={inputClass} />
            </Field>
          </div>
          <div className="grid gap-3 sm:grid-cols-[8rem_8rem_minmax(0,1fr)]">
            <Field label="Price (₹)" error={errors.price}>
              <input value={price} onChange={(e) => setPrice(e.target.value.replace(/[^\d]/g, ""))} inputMode="numeric" placeholder="449" className={inputClass} />
            </Field>
            <Field label="Stock" error={errors.stock}>
              <input value={stock} onChange={(e) => setStock(e.target.value.replace(/[^\d]/g, ""))} inputMode="numeric" placeholder="50" className={inputClass} />
            </Field>
            <Field label="Status">
              <button
                type="button"
                onClick={() => setActive((v) => !v)}
                className={cn(
                  "flex h-10 w-full items-center justify-between rounded-xl px-3 text-sm ring-1",
                  active ? "bg-emerald-50 text-emerald-800 ring-emerald-100" : "bg-ivory text-ink/70 ring-sage-100",
                )}
              >
                {active ? "Live" : "Archived"}
                <span className={cn("h-2 w-2 rounded-full", active ? "bg-emerald-600" : "bg-ink/30")} />
              </button>
            </Field>
          </div>

          <Field label="Description" hint="What the customer reads on the product page">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="A daily face wash with niacinamide, vitamin E, BHA and aloe vera."
              className={`${inputClass} min-h-24 resize-y`}
            />
          </Field>

          <div ref={extraBlockRef} className="space-y-4">
          {openExtras.includes("tagline") ? (
            <Field label="Tagline">
              <input value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="For sun-tanned & dull looking skin" className={inputClass} />
            </Field>
          ) : null}
          {openExtras.includes("displayName") ? (
            <Field label="Display name">
              <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="DAILY DETOX" className={inputClass} />
            </Field>
          ) : null}
          {openExtras.includes("compareAt") || openExtras.includes("netWeight") || openExtras.includes("lowStockThreshold") ? (
            <div className="grid gap-3 sm:grid-cols-3">
              {openExtras.includes("compareAt") ? (
                <Field label="Compare-at (₹)" hint="Struck-through price">
                  <input value={compareAt} onChange={(e) => setCompareAt(e.target.value.replace(/[^\d]/g, ""))} placeholder="599" className={inputClass} />
                </Field>
              ) : null}
              {openExtras.includes("netWeight") ? (
                <Field label="Net weight">
                  <input value={netWeight} onChange={(e) => setNetWeight(e.target.value)} placeholder="100 ml" className={inputClass} />
                </Field>
              ) : null}
              {openExtras.includes("lowStockThreshold") ? (
                <Field label="Low-stock alert">
                  <input value={lowStockThreshold} onChange={(e) => setLowStockThreshold(e.target.value.replace(/[^\d]/g, ""))} placeholder="8" className={inputClass} />
                </Field>
              ) : null}
            </div>
          ) : null}
          {openExtras.includes("cardLine") ? (
            <Field label="Card line">
              <input value={cardLine} onChange={(e) => setCardLine(e.target.value)} placeholder="Short line under the product card" className={inputClass} />
            </Field>
          ) : null}
          {openExtras.includes("ctaLabel") ? (
            <Field label="Button label">
              <input value={ctaLabel} onChange={(e) => setCtaLabel(e.target.value)} placeholder="Add to ritual" className={`${inputClass} max-w-xs`} />
            </Field>
          ) : null}
          {openExtras.includes("badges") ? (
            <Field label="Badges" hint="Comma separated, e.g. Derm tested, 100 ml">
              <input value={badges} onChange={(e) => setBadges(e.target.value)} placeholder="Derm tested, 100 ml" className={inputClass} />
            </Field>
          ) : null}

          {customFields.length ? (
            <div className="space-y-3">
              <p className={labelClass}>Custom fields</p>
              {customFields.map((field, i) => (
                <div key={`custom-${i}`} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                  <input
                    value={field.label}
                    onChange={(e) =>
                      setCustomFields((list) => list.map((row, idx) => (idx === i ? { ...row, label: e.target.value } : row)))
                    }
                    placeholder="Field name, e.g. Skin type"
                    className={inputClass}
                  />
                  <input
                    value={field.value}
                    onChange={(e) =>
                      setCustomFields((list) => list.map((row, idx) => (idx === i ? { ...row, value: e.target.value } : row)))
                    }
                    placeholder="Value, e.g. All skin types"
                    className={inputClass}
                  />
                  <button
                    type="button"
                    className="grid h-11 w-11 place-items-center rounded-2xl text-ink/40 ring-1 ring-sage-100 hover:text-red-700"
                    onClick={() => setCustomFields((list) => list.filter((_, idx) => idx !== i))}
                    aria-label="Remove field"
                  >
                    <Trash2 size={14} />
                  </button>
                  {errors[`custom-${i}`] ? <p className="md:col-span-3 text-[12px] text-red-700">{errors[`custom-${i}`]}</p> : null}
                </div>
              ))}
            </div>
          ) : null}
          </div>
        </div>

        <div className="relative min-w-0">
          <div className="flex items-center justify-between">
            <p className={labelClass}>Gallery</p>
            <span className="text-[12px] text-ink/65">
              {images.length}/{MAX_IMAGES}
            </span>
          </div>
          {errors.images ? <p className="mt-1 text-[12px] text-red-700">{errors.images}</p> : null}

          <div className="relative mt-3 min-h-36 overflow-hidden rounded-[24px]">
            <BusyOverlay show={uploading} label="Uploading images" />
            <button
              type="button"
              disabled={uploading || images.length >= MAX_IMAGES}
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                void uploadFiles(e.dataTransfer.files)
              }}
              className="flex min-h-28 w-full flex-col items-center justify-center gap-1.5 rounded-[24px] border border-dashed border-sage-200 bg-ivory px-4 py-5 text-center text-sm text-ink/70 disabled:opacity-50"
            >
              <span className="grid h-11 w-11 place-items-center rounded-full bg-white ring-1 ring-sage-100">
                <ImagePlus size={16} />
              </span>
              <span className="font-medium text-ink">Drop images here or browse</span>
              <span className="text-[12px] text-ink/65">JPG, PNG, WEBP, GIF · max 8MB · first image is the storefront cover</span>
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,video/mp4"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files) void uploadFiles(e.target.files)
              }}
            />

            {images.length ? (
              <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-[repeat(auto-fill,minmax(148px,1fr))]">
                {images.map((img, i) => (
                  <li key={`${img.src}-${i}`} className="overflow-hidden rounded-2xl bg-ivory ring-1 ring-sage-100">
                    <div className="relative aspect-square bg-peach">
                      {img.type === "video" ? (
                        <video src={img.src} className="h-full w-full object-contain" muted />
                      ) : (
                        <img src={img.src} alt={img.alt || name} className="h-full w-full object-contain p-2" />
                      )}
                      {i === 0 ? (
                        <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-sage-800 px-2 py-1 text-[10px] tracking-wide text-white uppercase">
                          <Star size={10} /> Front
                        </span>
                      ) : null}
                    </div>
                    <div className="flex items-center justify-between gap-1 px-2 py-2">
                      {i === 0 ? (
                        <span className="px-1 text-[12px] text-ink/65">Cover photo</span>
                      ) : (
                        <button type="button" className="px-1 text-[12px] text-sage-800 hover:underline" onClick={() => setCover(i)}>
                          Set as front
                        </button>
                      )}
                      <button
                        type="button"
                        className="grid h-8 w-8 place-items-center rounded-full text-ink/50 hover:bg-white hover:text-red-700"
                        onClick={() => setImages((list) => list.filter((_, idx) => idx !== i))}
                        aria-label="Remove image"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-[12px] text-ink/65">No images yet. The shop card and product page use the front image first.</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-3 border-t border-sage-50 bg-white px-5 py-4 md:px-7">
        <GoldButton type="button" loading={pending} disabled={uploading} onClick={() => void save()}>
          {pending ? "Saving" : editing ? "Update product" : "Save product"}
        </GoldButton>
        <button type="button" className="text-[13px] text-ink/50 hover:text-ink" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  )
}
