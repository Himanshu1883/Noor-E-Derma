type Level = "info" | "warn" | "error"

function redact(value: unknown): unknown {
  if (value == null) return value
  if (typeof value === "string") return value
  if (Array.isArray(value)) return value.map(redact)
  if (typeof value === "object") {
    const input = value as Record<string, unknown>
    const out: Record<string, unknown> = {}
    for (const [key, val] of Object.entries(input)) {
      if (/pass|secret|token|cookie|authorization|hash|signature/i.test(key)) {
        out[key] = "[redacted]"
      } else {
        out[key] = redact(val)
      }
    }
    return out
  }
  return value
}

function write(level: Level, message: string, extra?: unknown) {
  const line = { t: new Date().toISOString(), level, message, extra: extra ? redact(extra) : undefined }
  if (level === "error") console.error(JSON.stringify(line))
  else if (level === "warn") console.warn(JSON.stringify(line))
  else console.info(JSON.stringify(line))
}

export const logger = {
  info: (message: string, extra?: unknown) => write("info", message, extra),
  warn: (message: string, extra?: unknown) => write("warn", message, extra),
  error: (message: string, extra?: unknown) => write("error", message, extra),
}
