import nodemailer from "nodemailer"
import { env } from "@/lib/env"
import { logger } from "@/lib/logger"

type Mail = { to: string; subject: string; html: string; text?: string }

function transporter() {
  if (!env.smtpHost) return null
  return nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpPort === 465,
    auth: env.smtpUser ? { user: env.smtpUser, pass: env.smtpPass } : undefined,
  })
}

export async function sendMail(mail: Mail) {
  const transport = transporter()
  if (!transport) {
    logger.info("mail_console_fallback", { to: mail.to, subject: mail.subject })
    return
  }
  await transport.sendMail({
    from: env.smtpFrom,
    to: mail.to,
    subject: mail.subject,
    html: mail.html,
    text: mail.text ?? mail.html.replace(/<[^>]+>/g, " "),
  })
}

function wrap(title: string, body: string) {
  return `<div style="font-family:Georgia,serif;background:#fffbf2;padding:32px;color:#2e2210">
  <p style="letter-spacing:.28em;text-transform:uppercase;font-size:11px;color:#8a6212">NOOR E DERMA</p>
  <h1 style="font-weight:500">${title}</h1>
  <div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6">${body}</div>
</div>`
}

export async function sendVerifyEmail(to: string, url: string) {
  await sendMail({
    to,
    subject: "Verify your NOOR E DERMA account",
    html: wrap("Confirm your email", `<p>Welcome. Confirm your address to place orders.</p><p><a href="${url}">Verify email</a></p><p>This link expires in 24 hours.</p>`),
  })
}

export async function sendResetEmail(to: string, url: string) {
  await sendMail({
    to,
    subject: "Reset your NOOR E DERMA password",
    html: wrap("Password reset", `<p>We received a request to reset your password.</p><p><a href="${url}">Choose a new password</a></p><p>If you did not ask for this, you can ignore this email.</p>`),
  })
}

export async function sendOrderEmail(to: string, orderNumber: string, status: string, totalLabel: string) {
  await sendMail({
    to,
    subject: `Order ${orderNumber} — ${status}`,
    html: wrap(`Order ${orderNumber}`, `<p>Status: <strong>${status}</strong></p><p>Total: ${totalLabel}</p><p>You can track this order from your account.</p>`),
  })
}
