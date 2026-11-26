import { BadgeCheck } from "lucide-react"
import { StarRating } from "@/components/StarRating"
import type { Review } from "@/data/reviews"

export function PhotoReviewCard({ review }: { review: Review }) {
  const split = Boolean(review.beforeImage && review.afterImage)
  const contain = review.imageFit === "contain"
  const pos = review.imagePosition ?? "50% 55%"

  return (
    <figure className="flex w-full max-w-[min(300px,100%)] min-w-0 flex-col overflow-hidden rounded-[24px] bg-white/70 shadow-[0_18px_40px_-28px_rgb(var(--tint)/0.45)] ring-1 ring-sage-100">
      {split ? (
        <div className="grid aspect-[4/5] grid-cols-2">
          <div className="relative min-h-0 overflow-hidden">
            <img src={review.beforeImage} alt="Before Tan Eraser" className="h-full w-full object-cover" style={{ objectPosition: pos }} />
            <span className="absolute bottom-2.5 left-2.5 rounded-full bg-ink/70 px-2.5 py-0.5 text-[10px] font-semibold tracking-[0.14em] text-white uppercase">
              Before
            </span>
          </div>
          <div className="relative min-h-0 overflow-hidden border-l border-white/80">
            <img src={review.afterImage} alt="After Tan Eraser" className="h-full w-full object-cover" style={{ objectPosition: pos }} />
            <span className="absolute bottom-2.5 left-2.5 rounded-full gold-fill px-2.5 py-0.5 text-[10px] font-semibold tracking-[0.14em] text-white uppercase">
              After
            </span>
          </div>
        </div>
      ) : review.image ? (
        <div className={contain ? "relative flex aspect-[4/5] items-center bg-[rgb(var(--t-50))]" : "relative aspect-[4/5] overflow-hidden"}>
          <img
            src={review.image}
            alt={review.title}
            className={contain ? "h-full w-full object-contain" : "h-full w-full object-cover"}
            style={{ objectPosition: pos }}
          />
          {review.pairLabels ? (
            <>
              <span className="absolute bottom-2.5 left-2.5 rounded-full bg-ink/70 px-2.5 py-0.5 text-[10px] font-semibold tracking-[0.14em] text-white uppercase">
                Before
              </span>
              <span className="absolute right-2.5 bottom-2.5 rounded-full gold-fill px-2.5 py-0.5 text-[10px] font-semibold tracking-[0.14em] text-white uppercase">
                After
              </span>
            </>
          ) : null}
        </div>
      ) : null}

      <figcaption className="flex flex-1 flex-col p-4">
        <StarRating rating={review.rating} />
        <p className="mt-2.5 font-display text-[1.15rem] leading-snug">“{review.title}”</p>
        <p className="mt-1.5 line-clamp-3 text-[13px] leading-relaxed text-ink/65">{review.body}</p>
        <div className="mt-auto flex items-center gap-2 pt-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sage-800 text-[10px] font-semibold text-white">
            {review.initials}
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-[13px] font-semibold">{review.name}</span>
            {review.city ? <span className="block text-[11px] text-ink/45">{review.city}</span> : null}
          </span>
          {review.verified ? (
            <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-sage-50 px-2 py-0.5 text-[10px] font-medium text-sage-600">
              <BadgeCheck size={11} /> Verified
            </span>
          ) : null}
        </div>
      </figcaption>
    </figure>
  )
}
