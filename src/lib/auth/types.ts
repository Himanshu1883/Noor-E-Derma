export type PublicAddress = {
  _id?: string
  label?: string
  name: string
  phone: string
  line1: string
  line2?: string
  city: string
  state: string
  pincode: string
  country?: string
  isDefault?: boolean
}

export type PublicUser = {
  id: string
  name: string
  email: string
  phone: string
  role: "customer" | "admin"
  emailVerified: boolean
  addresses: PublicAddress[]
}
