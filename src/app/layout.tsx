import type { Metadata, Viewport } from "next"
import { AppShell } from "@/app/shell"
import { Providers } from "@/app/providers"
import "@/index.css"

export const metadata: Metadata = {
  title: {
    default: "NOOR E DERMA — Skin That Glows",
    template: "%s — NOOR E DERMA",
  },
  description: "NOOR E DERMA — Skin That Glows • Confidence That Shows. Tan Eraser, Daily Detox Face Wash, and the Glow Duo.",
  icons: {
    icon: [
      { url: "/assets/logo-nd.png", type: "image/png" },
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: "/assets/logo-nd.png",
    shortcut: "/assets/logo-nd.png",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

const themeScript = `(function(){document.documentElement.dataset.theme="a";try{localStorage.setItem("nd-theme","a")}catch(e){}})()`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="a" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Arapey:ital@0;1&family=Archivo:ital,wght@0,400;0,500;0,600;1,400&family=Roboto:wght@500&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  )
}
