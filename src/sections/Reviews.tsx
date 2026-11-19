import { BadgeCheck, Star } from "lucide-react"
import { StarRating } from "@/components/StarRating"
import { reviews } from "@/data/reviews"

const loop = [...reviews, ...reviews]

export function Reviews() {
  return (
    <section id="reviews" className="overflow-hidden dewy-sage py-20 md:py-28">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-5 md:flex-row md:items-end md:px-8">
        <div>
          <p className="eyebrow">Reviews</p>
          <h2 className="mt-3 text-[clamp(2.2rem,4.5vw,3.6rem)] leading-none font-medium">
            Glowing <span className="gold-text italic">reviews</span>
          </h2>
        </div>
        <div className="glass flex items-center gap-4 rounded-3xl px-5 py-3">
          <span className="font-display text-4xl font-medium">4.8</span>
          <div>
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={14} className="fill-gold-bright text-gold-bright" />
              ))}
            </div>
            <p className="text-xs text-ink/55">Placeholder rating · draft</p>
          </div>
        </div>
      </div>
      <div className="mt-10 [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)]">
        <div className="marquee-track flex w-max gap-5 px-5">
          {loop.map((review, i) => (
            <figure key={`${review.id}-${i}`} className="glass w-[340px] shrink-0 rounded-[28px] p-6">
              <StarRating rating={review.rating} />
              <p className="mt-3 font-display text-xl">“{review.title}”</p>
              <p className="mt-2 text-[14px] leading-relaxed text-ink/70">{review.body}</p>
              <figcaption className="mt-5 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sage-800 text-sm font-semibold text-white">
                  {review.initials}
                </span>
                <span className="leading-tight">
                  <span className="block text-sm font-semibold">{review.name}</span>
                  <span className="block text-xs text-ink/50">{review.city}</span>
                </span>
                {review.verified ? (
                  <span className="ml-auto flex items-center gap-1 rounded-full bg-sage-50 px-2.5 py-1 text-[11px] font-medium text-sage-600">
                    <BadgeCheck size={12} /> Verified Buyer
                  </span>
                ) : null}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
