import { MessageCircle } from "lucide-react"
import { Accordion } from "@/components/Accordion"
import { GoldButton } from "@/components/GoldButton"
import { homeFaqs } from "@/data/faq"

export function FAQ() {
  return (
    <section id="faq" className="bg-ivory py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-12 md:px-8">
        <div className="md:col-span-5">
          <p className="eyebrow">FAQ</p>
          <h2 className="mt-3 text-[clamp(2.2rem,4.5vw,3.6rem)] leading-none font-medium">
            Questions, <span className="gold-text italic">answered</span>
          </h2>
          <p className="mt-4 max-w-sm text-ink/60">Always follow the directions on your pack. Still unsure? Our team is happy to help.</p>
          <GoldButton variant="outline" className="mt-6" href="mailto:hello@noorederma.example">
            <MessageCircle size={16} /> Contact us
          </GoldButton>
        </div>
        <div className="md:col-span-7">
          <Accordion items={homeFaqs} />
        </div>
      </div>
    </section>
  )
}
