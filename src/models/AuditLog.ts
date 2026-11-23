import mongoose, { type InferSchemaType, type Model } from "mongoose"

const auditSchema = new mongoose.Schema(
  {
    actorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    actorEmail: { type: String, default: "" },
    action: { type: String, required: true, index: true },
    entity: { type: String, required: true },
    entityId: { type: String, default: "" },
    meta: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true },
)

export type AuditLogDoc = InferSchemaType<typeof auditSchema> & { _id: mongoose.Types.ObjectId }

export const AuditLog: Model<AuditLogDoc> =
  mongoose.models.AuditLog || mongoose.model<AuditLogDoc>("AuditLog", auditSchema)
