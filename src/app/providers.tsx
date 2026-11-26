"use client"

import type { ReactNode } from "react"
import { Toaster } from "sonner"
import { AuthProvider } from "@/context/AuthContext"
import { CartProvider } from "@/context/CartContext"
import { StoreSettingsProvider } from "@/context/StoreSettingsContext"
import { ThemeProvider } from "@/context/ThemeContext"
import { UIProvider } from "@/context/UIContext"
import { WishlistProvider } from "@/context/WishlistContext"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <UIProvider>
        <AuthProvider>
          <StoreSettingsProvider>
            <WishlistProvider>
              <CartProvider>
                {children}
                <Toaster
                  position="top-center"
                  offset={22}
                  duration={4000}
                  closeButton
                  visibleToasts={4}
                  className="!z-[400]"
                  style={{ zIndex: 400 }}
                  toastOptions={{
                    className: "font-[Archivo] text-sm !z-[400]",
                    closeButton: true,
                  }}
                />
              </CartProvider>
            </WishlistProvider>
          </StoreSettingsProvider>
        </AuthProvider>
      </UIProvider>
    </ThemeProvider>
  )
}
