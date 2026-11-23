import mongoose, { type HydratedDocument, type InferSchemaType, type Model } from "mongoose"

const mediaAssetSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    publicPath: { type: String, required: true, unique: true },
    fileId: { type: String, required: true },
    src: { type: String, required: true },
    filename: { type: String, required: true },
    contentType: { type: String, required: true },
    bytes: { type: Number, default: 0 },
  },
  { timestamps: true },
)

export type MediaAssetDoc = HydratedDocument<InferSchemaType<typeof mediaAssetSchema>>

export const MediaAsset: Model<MediaAssetDoc> =
  mongoose.models.MediaAsset || mongoose.model<MediaAssetDoc>("MediaAsset", mediaAssetSchema)
