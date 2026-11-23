function optional(name: string) {
  return process.env[name]?.trim() || ""
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  isProd: process.env.NODE_ENV === "production",
  appUrl: (optional("APP_URL") || "http://localhost:3003").replace(/\/$/, ""),
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
    return new URL(url).origin
  } catch {
    return url
  }
}
