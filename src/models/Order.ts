import mongoose, { type HydratedDocument, type InferSchemaType, type Model } from "mongoose"

export const ORDER_STATUSES = [
  "pending_payment",
  "paid",
  "confirmed",
  "packed",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
] as const

export const PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"] as const

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    email: { type: String, required: true, lowercase: true, index: true },
    phone: { type: String, required: true },
    name: { type: String, required: true },
    shipping: {
      name: String,
      phone: String,
      line1: String,
      line2: String,
      city: String,
      state: String,
      pincode: String,
      country: String,
    },
    lines: {
      type: [
        {
          productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
          slug: String,
          name: String,
          image: String,
          sku: String,
          price: Number,
          quantity: Number,
        },
      ],
      default: [],
    },
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    shippingFee: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
    couponCode: { type: String, default: "" },
    status: { type: String, enum: ORDER_STATUSES, default: "pending_payment", index: true },
    paymentStatus: { type: String, enum: PAYMENT_STATUSES, default: "pending", index: true },
    paymentMethod: { type: String, enum: ["cod", "razorpay"], default: "razorpay", index: true },
    timeline: {
      type: [
        new mongoose.Schema(
          {
            key: { type: String, required: true },
            title: { type: String, default: "" },
            detail: { type: String, default: "" },
            at: { type: Date, default: Date.now },
          },
          { _id: false },
        ),
      ],
      default: [],
    },
    razorpayOrderId: { type: String, index: true, sparse: true },
    razorpayPaymentId: { type: String },
    trackingNumber: { type: String, default: "" },
    carrier: { type: String, default: "" },
    trackingUrl: { type: String, default: "" },
    notes: { type: String, default: "" },
    cancelReason: { type: String, default: "" },
    inventoryReserved: { type: Boolean, default: false },
    inventoryCommitted: { type: Boolean, default: false },
    reservationExpiresAt: { type: Date },
    paidAt: { type: Date },
    cancelledAt: { type: Date },
    refundedAt: { type: Date },
  },
  { timestamps: true },
)

export type OrderAttrs = InferSchemaType<typeof orderSchema>
export type OrderDoc = HydratedDocument<OrderAttrs>

if (mongoose.models.Order) delete mongoose.models.Order

export const Order: Model<OrderAttrs> = mongoose.model<OrderAttrs>("Order", orderSchema)
