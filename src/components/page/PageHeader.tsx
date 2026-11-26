import Link from "next/link"
import { ChevronRight } from "lucide-react"

export type Crumb = { label: string; href?: string }

export function PageHeader({
  eyebrow,
  title,
  accent,
  lede,
  crumbs,
}: {
  eyebrow: string
  title: string
  accent?: string
  lede?: string
  crumbs?: Crumb[]
}) {
  return (
    <header className="mx-auto min-w-0 max-w-7xl px-5 md:px-8">
      {crumbs?.length ? (
        <nav className="flex flex-wrap items-center gap-1.5 text-[13px] text-ink/50" aria-label="Breadcrumb">
          {crumbs.map((c, i) => (
            <span key={`${c.label}-${i}`} className="flex items-center gap-1.5">
              {i > 0 ? <ChevronRight size={14} /> : null}
              {c.href ? (
                <Link href={c.href} className="hover:text-ink">
                  {c.label}
                </Link>
              ) : (
                <span className="text-ink">{c.label}</span>
              )}
            </span>
          ))}
        </nav>
      ) : null}
      <p className={`eyebrow ${crumbs?.length ? "mt-8" : ""}`}>{eyebrow}</p>
      <h1 className="mt-4 break-words text-[clamp(2.6rem,6vw,5.2rem)] leading-[0.95] font-medium">
        {title}
        {accent ? (
          <>
            {" "}
            <span className="gold-text italic">{accent}</span>
          </>
        ) : null}
      </h1>
      {lede ? <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink/70 md:text-lg">{lede}</p> : null}
    </header>
  )
}
