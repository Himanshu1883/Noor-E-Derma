import { json, withHandler } from "@/lib/api"
import { requireAdmin } from "@/lib/auth/session"
import { connectDb } from "@/lib/db"
import { Order } from "@/models/Order"
import { Product } from "@/models/Product"
import { User } from "@/models/User"

export const GET = withHandler(async () => {
  await requireAdmin()
  await connectDb()
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  start.setDate(start.getDate() - 6)

  const [orders, products, users, paidStats, weekPaid, statusGroups, catalog, lowStock, recent] = await Promise.all([
    Order.countDocuments(),
    Product.countDocuments(),
    User.countDocuments({ role: "customer" }),
    Order.aggregate<{ _id: null; revenue: number; count: number }>([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, revenue: { $sum: "$total" }, count: { $sum: 1 } } },
    ]),
    Order.find({ paymentStatus: "paid", createdAt: { $gte: start } })
      .select("total createdAt")
      .lean(),
    Order.aggregate<{ _id: string; n: number }>([{ $group: { _id: "$status", n: { $sum: 1 } } }]),
    Product.find({ active: true })
      .select("name slug sku price stock reserved images lowStockThreshold")
      .sort({ name: 1 })
      .lean(),
    Product.find({
      active: true,
      $expr: { $lte: [{ $subtract: ["$stock", "$reserved"] }, "$lowStockThreshold"] },
    })
      .select("name slug sku stock reserved lowStockThreshold images")
      .lean(),
    Order.find().sort({ createdAt: -1 }).limit(8).lean(),
  ])
  const revenue = paidStats[0]?.revenue ?? 0
  const paidCount = paidStats[0]?.count ?? 0
  const daily = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(start)
    day.setDate(start.getDate() + i)
    const next = new Date(day)
    next.setDate(day.getDate() + 1)
    const total = weekPaid
      .filter((o) => o.createdAt && o.createdAt >= day && o.createdAt < next)
      .reduce((sum, o) => sum + o.total, 0)
    return { date: day.toISOString().slice(0, 10), total, label: day.toLocaleDateString("en-IN", { weekday: "short" }) }
  })
  const reservedUnits = catalog.reduce((sum, p) => sum + (p.reserved ?? 0), 0)
  const onHand = catalog.reduce((sum, p) => sum + (p.stock ?? 0), 0)
  return json({
    orders,
    products,
    users,
    revenue,
    paidCount,
    averageOrder: paidCount ? Math.round(revenue / paidCount) : 0,
    weekRevenue: weekPaid.reduce((sum, o) => sum + o.total, 0),
    pendingCount: statusGroups.find((s) => s._id === "pending_payment")?.n ?? 0,
    shippedCount: statusGroups.find((s) => s._id === "shipped")?.n ?? 0,
    statusCounts: Object.fromEntries(statusGroups.map((s) => [s._id, s.n])),
    reservedUnits,
    onHand,
    daily,
    lowStock,
    recent,
    catalog,
  })
})
