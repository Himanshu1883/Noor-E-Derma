import mongoose from "mongoose"
import { env } from "@/lib/env"

type Cache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null; uri: string }

const globalForMongo = globalThis as typeof globalThis & { __mongoose?: Cache }

const cache: Cache = globalForMongo.__mongoose ?? { conn: null, promise: null, uri: "" }
globalForMongo.__mongoose = cache

export async function connectDb() {
  if (!env.mongodbUri) {
    throw new Error("MONGODB_URI is not set")
  }

  if (cache.uri !== env.mongodbUri) {
    if (cache.conn) {
      await cache.conn.disconnect().catch(() => undefined)
    }
    cache.conn = null
    cache.promise = null
    cache.uri = env.mongodbUri
  }

  if (cache.conn?.connection.readyState === 1) return cache.conn

  if (!cache.promise) {
    cache.promise = mongoose.connect(env.mongodbUri, {
      dbName: env.mongodbDb,
      maxPoolSize: 10,
      minPoolSize: 1,
      family: 4,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      socketTimeoutMS: 20_000,
      maxIdleTimeMS: 60_000,
    })
  }

  try {
    cache.conn = await cache.promise
    return cache.conn
  } catch (err) {
    cache.promise = null
    cache.conn = null
    throw err
  }
}

export function dbReady() {
  return Boolean(env.mongodbUri)
}
