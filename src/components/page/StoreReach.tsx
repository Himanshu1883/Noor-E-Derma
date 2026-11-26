"use client"

import { useStoreSettings } from "@/context/StoreSettingsContext"

export function StoreReach() {
  const store = useStoreSettings()
  return (
    <aside className="space-y-4 md:col-span-5">
      <div className="glass rounded-[32px] p-7">
        <p className="eyebrow">Hours</p>
        <p className="mt-3 text-lg">{store.hours}</p>
        {store.estimatedDelivery ? (
          <p className="mt-4 text-sm text-ink/60">Typical delivery {store.estimatedDelivery}.</p>
        ) : null}
      </div>
      <div className="glass rounded-[32px] p-7">
        <p className="eyebrow">Reach</p>
        <ul className="mt-4 space-y-2 text-ink/75">
          <li>
            Email ·{" "}
            <a className="text-gold-deep hover:underline" href={`mailto:${store.supportEmail}`}>
              {store.supportEmail}
            </a>
          </li>
          {store.whatsapp ? <li>WhatsApp · {store.whatsapp}</li> : null}
          {store.supportPhone ? <li>Phone · {store.supportPhone}</li> : null}
          {store.address ? <li>Address · {store.address}</li> : null}
        </ul>
        {store.footerNote ? <p className="mt-4 text-[12px] text-ink/55">{store.footerNote}</p> : null}
      </div>
    </aside>
  )
}
