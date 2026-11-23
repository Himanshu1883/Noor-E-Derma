import { connectDb } from "@/lib/db"
import { AuditLog } from "@/models/AuditLog"

export async function audit(input: {
  actorId?: string
  actorEmail?: string
  action: string
  entity: string
  entityId?: string
  meta?: Record<string, unknown>
}) {
  await connectDb()
  await AuditLog.create({
    actorId: input.actorId,
    actorEmail: input.actorEmail ?? "",
    action: input.action,
    entity: input.entity,
    entityId: input.entityId ?? "",
    meta: input.meta,
  })
}
