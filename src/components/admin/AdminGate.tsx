"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { InlineBusy } from "@/components/Busy"
import { useAuth } from "@/context/AuthContext"

export function AdminGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (!user) {
      let signedOut = false
      try {
        signedOut = sessionStorage.getItem("nd_signout") === "1"
        if (signedOut) sessionStorage.removeItem("nd_signout")
      } catch {
        /* private mode */
      }
      router.replace(signedOut ? "/" : "/?auth=login&next=/admin")
      return
    }
    if (user.role !== "admin") router.replace("/")
  }, [loading, user, router])

  if (loading || !user || user.role !== "admin") {
    return (
      <div className="grid min-h-svh place-items-center bg-[#fbf6ea]">
        <InlineBusy label="Loading admin" />
      </div>
    )
  }

  return <>{children}</>
}
