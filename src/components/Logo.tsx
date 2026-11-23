import Link from "next/link"
import { ASSETS, BRAND } from "@/data/config"
import { cn } from "@/lib/cn"

export function Logo({ className, imgClassName }: { className?: string; imgClassName?: string }) {
  return (
    <Link href="/" className={cn("inline-flex items-center", className)} aria-label={BRAND.name}>
      <img src={ASSETS.logo} alt={BRAND.name} className={cn("h-11 w-auto md:h-12", imgClassName)} />
    </Link>
  )
}
