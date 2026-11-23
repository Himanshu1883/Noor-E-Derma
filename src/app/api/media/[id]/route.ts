import { Readable } from "node:stream"
import { NextResponse } from "next/server"
import { getFile } from "@/lib/gridfs"

function parseRange(header: string | null, size: number) {
  if (!header || !header.startsWith("bytes=")) return null
  const [startRaw, endRaw] = header.replace("bytes=", "").split("-")
  const start = Number(startRaw)
  const end = endRaw ? Number(endRaw) : size - 1
  if (Number.isNaN(start) || Number.isNaN(end) || start > end || start >= size) return null
  return { start, end: Math.min(end, size - 1) }
}

async function bufferStream(stream: NodeJS.ReadableStream) {
  const chunks: Buffer[] = []
  for await (const chunk of stream) chunks.push(Buffer.from(chunk))
  return Buffer.concat(chunks)
}

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const found = await getFile(id)
  if (!found) return NextResponse.json({ error: "Not found" }, { status: 404 })
  const size = found.file.length
  const contentType = (found.file.metadata?.contentType as string | undefined) || "application/octet-stream"

  if (contentType.startsWith("image/") || contentType === "image/svg+xml") {
    const body = await bufferStream(found.stream)
    return new NextResponse(body, {
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(body.length),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  }

  const range = parseRange(request.headers.get("range"), size)
  if (range) {
    found.stream.destroy()
    const ranged = await getFile(id, range)
    if (!ranged) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return new NextResponse(Readable.toWeb(ranged.stream) as ReadableStream, {
      status: 206,
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(range.end - range.start + 1),
        "Content-Range": `bytes ${range.start}-${range.end}/${size}`,
        "Accept-Ranges": "bytes",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  }

  return new NextResponse(Readable.toWeb(found.stream) as ReadableStream, {
    headers: {
      "Content-Type": contentType,
      "Content-Length": String(size),
      "Accept-Ranges": "bytes",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  })
}
