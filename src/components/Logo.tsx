import Link from "next/link"
import { ASSETS, BRAND } from "@/data/config"
import { cn } from "@/lib/cn"

export function Logo({ className, imgClassName }: { className?: string; imgClassName?: string }) {
  const size = imgClassName ?? "h-11 md:h-12"

  return (
    <Link href="/" className={cn("group inline-flex items-center overflow-visible", className)} aria-label={BRAND.name}>
      <span className={cn("flex max-w-[4.75rem] flex-col items-center justify-center overflow-hidden leading-none md:max-w-none", size)}>
        <img
          src={ASSETS.logoMark}
          alt=""
          aria-hidden
          className="h-[72%] w-auto max-w-full origin-center object-contain motion-reduce:group-hover:animate-none group-hover:animate-[logo-mark-spin_0.9s_ease-in-out]"
        />
        <img src={ASSETS.logoText} alt={BRAND.name} className="mt-px h-[24%] w-auto max-w-full object-contain" />
      </span>
    </Link>
  )
}
