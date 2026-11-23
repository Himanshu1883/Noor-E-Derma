"use client"

import type { ReactNode } from "react"
import { Toaster } from "sonner"
import { AuthProvider } from "@/context/AuthContext"
import { CartProvider } from "@/context/CartContext"
import { ThemeProvider } from "@/context/ThemeContext"
import { UIProvider } from "@/context/UIContext"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <UIProvider>
        <AuthProvider>
          <CartProvider>
            {children}
            <Toaster
              position="top-center"
              offset={18}
              duration={2800}
              closeButton
              style={{ zIndex: 200 }}
              toastOptions={{
                className: "font-[Archivo] text-sm",
                closeButton: true,
              }}
            />
          </CartProvider>
        </AuthProvider>
      </UIProvider>
    </ThemeProvider>
  )
}
