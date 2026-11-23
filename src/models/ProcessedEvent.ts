import mongoose, { type InferSchemaType, type Model } from "mongoose"

const processedEventSchema = new mongoose.Schema(
  {
    eventId: { type: String, required: true, unique: true },
  },
  { timestamps: true },
)

export type ProcessedEventDoc = InferSchemaType<typeof processedEventSchema> & { _id: mongoose.Types.ObjectId }

export const ProcessedEvent: Model<ProcessedEventDoc> =
  mongoose.models.ProcessedEvent || mongoose.model<ProcessedEventDoc>("ProcessedEvent", processedEventSchema)
