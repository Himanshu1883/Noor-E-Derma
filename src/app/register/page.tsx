import { redirect } from "next/navigation"

export const metadata = { title: "Create account" }

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const { next } = await searchParams
  const q = new URLSearchParams({ auth: "register" })
  if (next) q.set("next", next)
  redirect(`/?${q.toString()}`)
}
