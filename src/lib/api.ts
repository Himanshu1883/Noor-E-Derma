import { NextResponse } from "next/server"
import { ZodError, type ZodType } from "zod"
import { allowedOrigins } from "@/lib/env"
import { logger } from "@/lib/logger"

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string,
  ) {
    super(message)
  }
}

export function json<T>(data: T, status = 200) {
  return NextResponse.json(data, { status, headers: { "Cache-Control": "no-store" } })
}

export function errorResponse(err: unknown) {
  if (err instanceof ZodError) {
    const first = err.issues[0]?.message ?? "Invalid input"
    return json({ error: first, details: err.flatten() }, 400)
  }
  if (err instanceof ApiError) {
    return json({ error: err.message, code: err.code }, err.status)
  }
  const message = err instanceof Error ? err.message : typeof err === "object" && err ? JSON.stringify(err) : String(err)
  logger.error("unhandled_api_error", { err: message })
  return json({ error: "Something went wrong. Please try again." }, 500)
}

export async function parseJson<T>(request: Request, schema: ZodType<T>): Promise<T> {
  const body = await request.json().catch(() => null)
  if (body == null || typeof body !== "object") throw new ApiError(400, "Invalid JSON body")
  return schema.parse(body)
}

export function clientIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "127.0.0.1"
}

export function assertSameOrigin(request: Request) {
  if (request.method === "GET" || request.method === "HEAD" || request.method === "OPTIONS") return
  const url = new URL(request.url)
  if (url.pathname.includes("/webhook")) return
  const origin = request.headers.get("origin")
  if (!origin) return
  if (!allowedOrigins(request).has(origin)) throw new ApiError(403, "Invalid request origin")
}

export function withHandler(fn: (request: Request, context?: unknown) => Promise<Response>) {
  return async (request: Request, context?: unknown) => {
    try {
      assertSameOrigin(request)
      return await fn(request, context)
    } catch (err) {
      return errorResponse(err)
    }
  }
}
