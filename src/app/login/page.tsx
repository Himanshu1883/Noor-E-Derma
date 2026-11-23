import { redirect } from "next/navigation"

export const metadata = { title: "Sign in" }

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>
}) {
  const { next, error } = await searchParams
  const q = new URLSearchParams({ auth: "login" })
  if (next) q.set("next", next)
  if (error) q.set("error", error)
  redirect(`/?${q.toString()}`)
}
