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
  get nodeEnv() {
    return process.env.NODE_ENV ?? "development"
  },
  get isProd() {
    return process.env.NODE_ENV === "production"
  },
  get appUrl() {
    return withProtocol(optional("APP_URL") || optional("VERCEL_PROJECT_PRODUCTION_URL") || "http://localhost:3000")
  },
  get extraOrigins() {
    return optional("ALLOWED_ORIGINS")
  },
  get mongodbUri() {
    return optional("MONGODB_URI")
  },
  get mongodbDb() {
    return optional("MONGODB_DB") || "noor-e-derma"
  },
  get sessionSecret() {
    return optional("SESSION_SECRET")
  },
  get adminEmail() {
    return optional("ADMIN_EMAIL").toLowerCase()
  },
  get adminPassword() {
    return optional("ADMIN_PASSWORD")
  },
  get googleClientId() {
    return optional("GOOGLE_CLIENT_ID")
  },
  get googleClientSecret() {
    return optional("GOOGLE_CLIENT_SECRET")
  },
  get razorpayKeyId() {
    return optional("RAZORPAY_KEY_ID")
  },
  get razorpayKeySecret() {
    return optional("RAZORPAY_KEY_SECRET")
  },
  get razorpayWebhookSecret() {
    return optional("RAZORPAY_WEBHOOK_SECRET")
  },
  get smtpHost() {
    return optional("SMTP_HOST")
  },
  get smtpPort() {
    return Number(optional("SMTP_PORT") || "587")
  },
  get smtpUser() {
    return optional("SMTP_USER")
  },
  get smtpPass() {
    return optional("SMTP_PASS")
  },
  get smtpFrom() {
    return optional("SMTP_FROM") || "NOOR E DERMA <hello@noorederma.example>"
  },
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
