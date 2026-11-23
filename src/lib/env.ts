function optional(name: string) {
  return process.env[name]?.trim() || ""
}

function withProtocol(url: string) {
  const trimmed = url.replace(/\/$/, "")
  if (!trimmed) return trimmed
  if (trimmed.includes("://")) return trimmed
  return trimmed.startsWith("localhost") || trimmed.startsWith("127.") ? `http://${trimmed}` : `https://${trimmed}`
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  isProd: process.env.NODE_ENV === "production",
  appUrl: withProtocol(optional("APP_URL") || optional("VERCEL_PROJECT_PRODUCTION_URL") || "http://localhost:3003"),
  extraOrigins: optional("ALLOWED_ORIGINS"),
  mongodbUri: optional("MONGODB_URI"),
  mongodbDb: optional("MONGODB_DB") || "noor-e-derma",
  sessionSecret: optional("SESSION_SECRET"),
  adminEmail: optional("ADMIN_EMAIL").toLowerCase(),
  adminPassword: optional("ADMIN_PASSWORD"),
  googleClientId: optional("GOOGLE_CLIENT_ID"),
  googleClientSecret: optional("GOOGLE_CLIENT_SECRET"),
  razorpayKeyId: optional("RAZORPAY_KEY_ID"),
  razorpayKeySecret: optional("RAZORPAY_KEY_SECRET"),
  razorpayWebhookSecret: optional("RAZORPAY_WEBHOOK_SECRET"),
  smtpHost: optional("SMTP_HOST"),
  smtpPort: Number(optional("SMTP_PORT") || "587"),
  smtpUser: optional("SMTP_USER"),
  smtpPass: optional("SMTP_PASS"),
  smtpFrom: optional("SMTP_FROM") || "NOOR E DERMA <hello@noorederma.example>",
}

export function originOf(url: string) {
  try {
    const href = url.includes("://") ? url : `https://${url}`
    return new URL(href).origin
  } catch {
    return url.replace(/\/$/, "")
  }
}

function addOrigin(set: Set<string>, value?: string) {
  const raw = value?.trim()
  if (!raw) return
  const origin = originOf(raw)
  if (!origin) return
  set.add(origin)
  try {
    const parsed = new URL(origin)
    if (parsed.hostname.startsWith("www.")) {
      parsed.hostname = parsed.hostname.slice(4)
      set.add(parsed.origin)
    } else {
      parsed.hostname = `www.${parsed.hostname}`
      set.add(parsed.origin)
    }
  } catch {
    /* ignore */
  }
}

export function allowedOrigins(request?: Request) {
  const origins = new Set<string>()
  addOrigin(origins, env.appUrl)
  addOrigin(origins, process.env.VERCEL_URL)
  addOrigin(origins, process.env.VERCEL_PROJECT_PRODUCTION_URL)
  addOrigin(origins, process.env.VERCEL_BRANCH_URL)
  for (const extra of env.extraOrigins.split(",")) addOrigin(origins, extra)
  if (request) {
    addOrigin(origins, request.url)
    const host = request.headers.get("x-forwarded-host") || request.headers.get("host")
    const proto = request.headers.get("x-forwarded-proto") || (env.isProd ? "https" : "http")
    if (host) addOrigin(origins, `${proto}://${host.split(",")[0].trim()}`)
  }
  return origins
}
