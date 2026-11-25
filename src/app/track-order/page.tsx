import type { Metadata } from "next"
import { Suspense } from "react"
import { TrackOrderPage } from "@/views/TrackOrderPage"

export const metadata: Metadata = {
  title: "Track order",
  description: "Track a Noor E Derma order with your order ID and checkout phone number.",
}

export default function Page() {
  return (
    <Suspense>
      <TrackOrderPage />
    </Suspense>
  )
}
