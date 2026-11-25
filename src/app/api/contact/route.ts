import { json, withHandler } from "@/lib/api"
import { clientIp } from "@/lib/api"
import { sendMail } from "@/lib/mail"
import { rateLimit } from "@/lib/rate-limit"
import { z } from "zod"

export const POST = withHandler(async (request) => {
  rateLimit(`contact:${clientIp(request)}`, 6, 15 * 60 * 1000)
  const body = z
    .object({
      name: z.string().trim().min(2).max(80),
      email: z.string().email(),
      phone: z.string().trim().min(8).max(20),
      comment: z.string().trim().min(8).max(2000),
    })
    .parse(await request.json())
  await sendMail({
    to: process.env.SMTP_FROM?.replace(/.*<|>/g, "") || "hello@noorederma.com",
    subject: `Contact: ${body.name}`,
    html: `<p>${body.name} (${body.email}, ${body.phone})</p><p>${body.comment}</p>`,
  })
  return json({ message: "Message sent. We will reply in business hours." })
})
