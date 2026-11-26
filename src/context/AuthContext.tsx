"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { toast } from "sonner"
import { api } from "@/lib/client"
import type { PublicUser } from "@/lib/auth/types"

const USER_KEY = "nd_user"

type AuthValue = {
  user: PublicUser | null
  loading: boolean
  refresh: () => Promise<void>
  applyUser: (user: PublicUser | null) => void
  logout: (opts?: { silent?: boolean }) => Promise<void>
}

const AuthContext = createContext<AuthValue | null>(null)

function readCachedUser(): PublicUser | null {
  try {
    const raw = sessionStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as PublicUser) : null
  } catch {
    return null
  }
}

function writeCachedUser(user: PublicUser | null) {
  try {
    if (user) sessionStorage.setItem(USER_KEY, JSON.stringify(user))
    else sessionStorage.removeItem(USER_KEY)
  } catch {
    /* quota / private mode */
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null)
  const [loading, setLoading] = useState(true)

  const persist = (next: PublicUser | null) => {
    setUser(next)
    setLoading(false)
    writeCachedUser(next)
  }

  const refresh = async () => {
    try {
      const data = await api<{ user: PublicUser | null }>("/api/auth/me")
      persist(data.user)
    } catch {
      setLoading(false)
    }
  }

  useEffect(() => {
    const cached = readCachedUser()
    if (cached) persist(cached)
    void refresh()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        refresh,
        applyUser: persist,
        logout: async (opts) => {
          if (!opts?.silent) {
            toast.success("Signed out", { id: "auth-signed-out", duration: 4000 })
          }
          try {
            sessionStorage.setItem("nd_signout", "1")
          } catch {
            /* private mode */
          }
          try {
            await api("/api/auth/logout", { method: "POST" })
          } catch {
            /* still clear the local session */
          }
          persist(null)
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
