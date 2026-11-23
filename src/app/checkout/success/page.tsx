import Link from "next/link"

export default async function Page({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const { order } = await searchParams
  return (
    <main className="dewy pt-28 pb-24">
      <div className="mx-auto max-w-lg px-5 text-center">
        <p className="eyebrow">Thank you</p>
        <h1 className="mt-3 text-5xl">Order placed</h1>
        <p className="mt-4 text-ink/70">Your payment was received. Order {order ?? ""} is confirmed.</p>
        <Link href="/account/orders" className="gold-fill mt-8 inline-flex rounded-full px-6 py-3 text-[13px] text-white">
          View orders
        </Link>
      </div>
    </main>
  )
}
