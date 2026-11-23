import { createReadStream } from "node:fs"
import { GridFSBucket, ObjectId, type GridFSFile } from "mongodb"
import mongoose from "mongoose"
import { connectDb } from "@/lib/db"

export async function gridBucket() {
  const conn = await connectDb()
  const db = conn.connection.db
  if (!db) throw new Error("Mongo database is not ready")
  return new GridFSBucket(db, { bucketName: "media" })
}

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml", "video/mp4"])
const MAX_BYTES = 50 * 1024 * 1024

export async function saveUpload(file: File) {
  if (!ALLOWED.has(file.type)) throw new Error("Unsupported file type")
  if (file.size > MAX_BYTES) throw new Error("File is too large (max 50MB)")
  const bucket = await gridBucket()
  const buf = Buffer.from(await file.arrayBuffer())
  const id = new ObjectId()
  await new Promise<void>((resolve, reject) => {
    const stream = bucket.openUploadStreamWithId(id, file.name, {
      metadata: { originalName: file.name, contentType: file.type },
    })
    stream.on("error", reject)
    stream.on("finish", () => resolve())
    stream.end(buf)
  })
  return { id: String(id), src: `/api/media/${id}` }
}

export async function saveFromPath(filePath: string, filename: string, contentType: string) {
  if (!ALLOWED.has(contentType)) throw new Error("Unsupported file type")
  const bucket = await gridBucket()
  const id = new ObjectId()
  await new Promise<void>((resolve, reject) => {
    const stream = bucket.openUploadStreamWithId(id, filename, {
      metadata: { originalName: filename, contentType },
    })
    stream.on("error", reject)
    stream.on("finish", () => resolve())
    createReadStream(filePath).on("error", reject).pipe(stream)
  })
  return { id: String(id), src: `/api/media/${id}` }
}

export async function getFile(id: string, range?: { start: number; end: number }) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null
  const bucket = await gridBucket()
  const oid = new ObjectId(id)
  const files = await bucket.find({ _id: oid }).toArray()
  const file = files[0] as GridFSFile | undefined
  if (!file) return null
  const stream = range
    ? bucket.openDownloadStream(oid, { start: range.start, end: range.end + 1 })
    : bucket.openDownloadStream(oid)
  return { file, stream }
}

export async function deleteFile(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) return
  const bucket = await gridBucket()
  try {
    await bucket.delete(new ObjectId(id))
  } catch {
    /* already gone */
  }
}
