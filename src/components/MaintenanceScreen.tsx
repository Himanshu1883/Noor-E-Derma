"use client"

import { GoldButton } from "@/components/GoldButton"
import { Logo } from "@/components/Logo"
import { useStoreSettings } from "@/context/StoreSettingsContext"
import { useUI } from "@/context/UIContext"

export function MaintenanceScreen() {
  const { storeName, maintenanceMessage } = useStoreSettings()
  const { openAuth } = useUI()

  return (
    <main className="grid min-h-svh place-items-center bg-ivory px-6 text-center">
      <div className="max-w-md">
        <div className="flex justify-center">
          <Logo />
        </div>
        <h1 className="mt-8 text-4xl">{storeName}</h1>
        <p className="mt-4 text-ink/65">{maintenanceMessage || "We're updating the shop. Please check back shortly."}</p>
        <GoldButton className="mt-8" onClick={() => openAuth("login")}>
          Staff sign in
        </GoldButton>
      </div>
    </main>
  )
}
