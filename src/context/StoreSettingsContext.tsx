"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { api } from "@/lib/client"
import { STORE_DEFAULTS, type StorefrontSettings } from "@/lib/storefront-settings"

const StoreSettingsContext = createContext<StorefrontSettings>(STORE_DEFAULTS)

export function StoreSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<StorefrontSettings>(STORE_DEFAULTS)

  useEffect(() => {
    api<{ settings: StorefrontSettings }>("/api/store")
      .then((d) => setSettings({ ...STORE_DEFAULTS, ...d.settings }))
      .catch(() => undefined)
  }, [])

  return <StoreSettingsContext.Provider value={settings}>{children}</StoreSettingsContext.Provider>
}

export function useStoreSettings() {
  return useContext(StoreSettingsContext)
}
