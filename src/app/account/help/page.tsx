"use client"

import { Accordion } from "@/components/Accordion"
import { AccountCard } from "@/components/account/ui"
import { GoldButton } from "@/components/GoldButton"
import { useStoreSettings } from "@/context/StoreSettingsContext"
import { homeFaqs } from "@/data/faq"

export default function HelpPage() {
  const store = useStoreSettings()
  return (
    <div>
      <p className="eyebrow">Account</p>
      <h1 className="mt-2 text-4xl md:text-5xl">Help</h1>
      <p className="mt-2 max-w-xl text-sm text-ink/55">
        Short answers for the ritual, the pack, and the parcel. Write to us if you still need a hand.
      </p>

      <AccountCard className="mt-6">
        <Accordion items={homeFaqs} />
      </AccountCard>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <AccountCard>
          <p className="text-[12px] font-medium tracking-wide text-ink/45 uppercase">Support</p>
          <p className="mt-2 text-sm">{store.supportEmail}</p>
          {store.supportPhone ? <p className="text-sm">{store.supportPhone}</p> : null}
          <p className="mt-2 text-[12px] text-ink/50">{store.hours}</p>
        </AccountCard>
        <AccountCard className="flex flex-col justify-between">
          <p className="text-sm text-ink/60">Need something that is not in the FAQ?</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <GoldButton to="/contact" className="px-5 py-2.5 text-[12px]">
              Contact us
            </GoldButton>
            <GoldButton to="/track-order" variant="outline" className="px-5 py-2.5 text-[12px]">
              Track order
            </GoldButton>
          </div>
        </AccountCard>
      </div>
    </div>
  )
}
