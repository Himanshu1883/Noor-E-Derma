import mongoose, { type InferSchemaType, type Model } from "mongoose"

const inventoryLogSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true, index: true },
    type: { type: String, enum: ["sale", "restock", "reserve", "release", "adjust"], required: true },
    quantity: { type: Number, required: true },
    note: { type: String, default: "" },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    actorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
)

export type InventoryLogDoc = InferSchemaType<typeof inventoryLogSchema> & { _id: mongoose.Types.ObjectId }

export const InventoryLog: Model<InventoryLogDoc> =
  mongoose.models.InventoryLog || mongoose.model<InventoryLogDoc>("InventoryLog", inventoryLogSchema)
