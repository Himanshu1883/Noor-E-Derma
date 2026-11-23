import { redirect } from "next/navigation"
import { AdminShell } from "@/components/admin/AdminShell"
import { getSessionUser } from "@/lib/auth/session"

export const metadata = { title: "Admin console" }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  let user
  try {
    user = await getSessionUser()
  } catch {
    redirect("/?auth=login&next=/admin")
  }
  if (!user) redirect("/?auth=login&next=/admin")
  if (user.role !== "admin") redirect("/")
  return <AdminShell>{children}</AdminShell>
}
