import { z } from "zod"

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password is too long")
  .regex(/[A-Za-z]/, "Password must include a letter")
  .regex(/[0-9]/, "Password must include a number")

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  email: z.string().trim().email("Enter a valid email").max(120),
  password: passwordSchema,
})

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
})

export const emailSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
})

export const resetSchema = z.object({
  token: z.string().min(20),
  password: passwordSchema,
})

export const profileSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().max(20).optional().default(""),
})

export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: passwordSchema,
})

export const addressSchema = z.object({
  id: z.string().optional(),
  label: z.string().trim().max(40).optional().default("Home"),
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(8).max(20),
  line1: z.string().trim().min(4).max(120),
  line2: z.string().trim().max(120).optional().default(""),
  city: z.string().trim().min(2).max(60),
  state: z.string().trim().min(2).max(60),
  pincode: z.string().trim().regex(/^\d{6}$/, "Enter a 6-digit PIN code"),
  country: z.string().trim().max(40).optional().default("India"),
  isDefault: z.boolean().optional().default(false),
})

export const productInputSchema = z.object({
  slug: z.string().trim().min(2).max(80).regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and dashes"),
  sku: z.string().trim().min(2).max(40),
  name: z.string().trim().min(2).max(80),
  displayName: z.string().trim().max(80).optional().default(""),
  tagline: z.string().trim().max(160).optional().default(""),
  description: z.string().trim().max(4000).optional().default(""),
  cardLine: z.string().trim().max(160).optional().default(""),
  price: z.number().int().positive(),
  compareAt: z.number().int().positive().optional(),
  netWeight: z.string().trim().max(40).optional().default(""),
  stock: z.number().int().min(0),
  lowStockThreshold: z.number().int().min(0).optional().default(8),
  active: z.boolean().optional().default(true),
  hasDetailPage: z.boolean().optional().default(true),
  isBundle: z.boolean().optional().default(false),
  bundleOf: z.array(z.string()).optional().default([]),
  categorySlugs: z.array(z.string()).optional().default([]),
  images: z
    .array(
      z.object({
        src: z.string().min(1),
        alt: z.string().optional().default(""),
        position: z.string().optional(),
        scale: z.number().optional(),
        type: z.enum(["image", "video"]).optional().default("image"),
        poster: z.string().optional(),
        fileId: z.string().optional(),
      }),
    )
    .optional()
    .default([]),
  benefits: z.array(z.object({ label: z.string(), detail: z.string(), icon: z.string() })).optional().default([]),
  actives: z.array(z.object({ name: z.string(), note: z.string(), percent: z.string().optional() })).optional().default([]),
  howToUse: z.array(z.object({ step: z.number(), title: z.string(), body: z.string() })).optional().default([]),
  faqs: z.array(z.object({ q: z.string(), a: z.string() })).optional().default([]),
  badges: z.array(z.string()).optional().default([]),
  kitIncludes: z.array(z.string()).optional().default([]),
  ctaLabel: z.string().optional().default(""),
  customFields: z
    .array(
      z.object({
        label: z.string().trim().min(1).max(80),
        value: z.string().trim().min(1).max(400),
      }),
    )
    .optional()
    .default([]),
})

export const checkoutSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email(),
  phone: z.string().trim().min(8).max(20),
  saveAddress: z.boolean().optional().default(true),
  couponCode: z.string().trim().max(40).optional().default(""),
  paymentMethod: z.enum(["cod", "razorpay"]).optional().default("razorpay"),
  shipping: addressSchema.omit({ id: true, isDefault: true, label: true }),
})

export const couponSchema = z.object({
  code: z.string().trim().min(3).max(24),
  type: z.enum(["percent", "fixed"]),
  value: z.number().positive(),
  minSubtotal: z.number().min(0).optional().default(0),
  maxUses: z.number().int().min(0).optional().default(0),
  expiresAt: z.string().optional(),
  active: z.boolean().optional().default(true),
  firstOrderOnly: z.boolean().optional().default(false),
})

export const settingsSchema = z.object({
  storeName: z.string().trim().min(2).max(80),
  supportEmail: z.string().trim().email(),
  supportPhone: z.string().trim().max(20).optional().default(""),
  shippingFee: z.number().min(0),
  freeShippingOver: z.number().min(0),
  taxPercent: z.number().min(0).max(40),
  lowStockThreshold: z.number().int().min(0),
  announcement: z.string().max(200).optional().default(""),
  paymentsEnabled: z.boolean(),
})

export const inventoryAdjustSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int(),
  note: z.string().trim().max(160).optional().default(""),
})
