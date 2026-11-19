export function formatINR(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value)
}

export function savePercent(price: number, compareAt?: number) {
  if (!compareAt || compareAt <= price) return 0
  return Math.round(((compareAt - price) / compareAt) * 100)
}
