import type { Metadata } from "next"
import { ShopPage } from "@/views/ShopPage"

export const metadata: Metadata = {
  title: "Shop all",
  description: "Shop Noor E Derma Tan Eraser, Daily Detox Face Wash, and the Glow Duo.",
}

export default function Page() {
  return <ShopPage />
}
