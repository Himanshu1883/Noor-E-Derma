const getCache = new Map<string, { t: number; data: unknown; inflight?: Promise<unknown> }>()

export function bustApi(prefix = "/api/admin") {
  for (const key of [...getCache.keys()]) {
    if (!prefix || key.startsWith(prefix)) getCache.delete(key)
  }
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const method = (init?.method ?? "GET").toUpperCase()
  if (method === "GET") {
    const hit = getCache.get(path)
    if (hit?.data && Date.now() - hit.t < 30_000) return hit.data as T
    if (hit?.inflight) return hit.inflight as Promise<T>
    const inflight = fetchJson<T>(path, init).then((data) => {
      getCache.set(path, { t: Date.now(), data })
      return data
    })
    getCache.set(path, { t: hit?.t ?? 0, data: hit?.data, inflight })
    try {
      return await inflight
    } catch (err) {
      getCache.delete(path)
      throw err
    }
  }
  const data = await fetchJson<T>(path, init)
  getCache.clear()
  return data
}

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    credentials: "include",
    headers: {
      ...(init?.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(init?.headers ?? {}),
    },
  })
  const data = (await res.json().catch(() => ({}))) as T & { error?: string }
  if (!res.ok) throw new Error(data.error || "Request failed")
  return data
}
