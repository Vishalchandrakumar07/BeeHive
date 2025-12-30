export type Apartment = {
  id: string
  name: string
  address: string
  totalFlats: number
}

export type ShopCategory =
  | "Groceries"
  | "Pharmacy"
  | "Bakery"
  | "Stationery"
  | "Electronics"
  | "Clothing"
  | "Restaurant"
  | "Other"

export type Shop = {
  id: string
  name: string
  category: ShopCategory
  isOpen: boolean
  phoneNumber: string
  sellerId: string
  isApproved: boolean
  apartmentIds: string[]
}

export type Product = {
  id: string
  shopId: string
  name: string
  price: number
  isAvailable: boolean
  image?: string
}

export type CartItem = {
  product: Product
  quantity: number
}

export type User = {
  id: string
  email: string
  role: "customer" | "seller" | "admin"
  sellerId?: string
}
