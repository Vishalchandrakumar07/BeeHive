import type { Apartment, Shop, Product } from "./types"

export const apartments: Apartment[] = [
  {
    id: "apt-1",
    name: "Skyline Residences",
    address: "Block A, Sector 12, Mumbai",
    totalFlats: 120,
  },
  {
    id: "apt-2",
    name: "Green Valley Apartments",
    address: "Plot 45, HSR Layout, Bangalore",
    totalFlats: 80,
  },
  {
    id: "apt-3",
    name: "Palm Heights",
    address: "Phase 2, Gurgaon",
    totalFlats: 150,
  },
]

export const shops: Shop[] = [
  {
    id: "shop-1",
    name: "Fresh Mart",
    category: "Groceries",
    isOpen: true,
    phoneNumber: "+919876543210",
    sellerId: "seller-1",
    isApproved: true,
    apartmentIds: ["apt-1", "apt-2"],
  },
  {
    id: "shop-2",
    name: "HealthPlus Pharmacy",
    category: "Pharmacy",
    isOpen: true,
    phoneNumber: "+919876543211",
    sellerId: "seller-2",
    isApproved: true,
    apartmentIds: ["apt-1"],
  },
  {
    id: "shop-3",
    name: "Baker's Delight",
    category: "Bakery",
    isOpen: false,
    phoneNumber: "+919876543212",
    sellerId: "seller-3",
    isApproved: true,
    apartmentIds: ["apt-1", "apt-3"],
  },
  {
    id: "shop-4",
    name: "Tech Corner",
    category: "Electronics",
    isOpen: true,
    phoneNumber: "+919876543213",
    sellerId: "seller-4",
    isApproved: true,
    apartmentIds: ["apt-2"],
  },
  {
    id: "shop-5",
    name: "Pages & Pens",
    category: "Stationery",
    isOpen: true,
    phoneNumber: "+919876543214",
    sellerId: "seller-5",
    isApproved: true,
    apartmentIds: ["apt-2", "apt-3"],
  },
]

export const products: Product[] = [
  // Fresh Mart Products
  {
    id: "prod-1",
    shopId: "shop-1",
    name: "Fresh Milk (1L)",
    price: 60,
    isAvailable: true,
    image: "/vintage-milk-bottle.png",
  },
  {
    id: "prod-2",
    shopId: "shop-1",
    name: "Bread (White)",
    price: 40,
    isAvailable: true,
    image: "/rustic-bread-loaf.png",
  },
  {
    id: "prod-3",
    shopId: "shop-1",
    name: "Eggs (12 pcs)",
    price: 84,
    isAvailable: true,
    image: "/eggs-carton.png",
  },
  {
    id: "prod-4",
    shopId: "shop-1",
    name: "Rice (5kg)",
    price: 350,
    isAvailable: true,
    image: "/rice-bag.png",
  },
  // HealthPlus Pharmacy Products
  {
    id: "prod-5",
    shopId: "shop-2",
    name: "Paracetamol (Strip)",
    price: 15,
    isAvailable: true,
    image: "/medicine-strip.jpg",
  },
  {
    id: "prod-6",
    shopId: "shop-2",
    name: "Hand Sanitizer",
    price: 80,
    isAvailable: true,
    image: "/hand-sanitizer-bottle.jpg",
  },
  {
    id: "prod-7",
    shopId: "shop-2",
    name: "Band-Aid (Pack)",
    price: 50,
    isAvailable: true,
    image: "/bandaid-box.jpg",
  },
  // Baker's Delight Products
  {
    id: "prod-8",
    shopId: "shop-3",
    name: "Chocolate Cake",
    price: 450,
    isAvailable: true,
    image: "/decadent-chocolate-cake.png",
  },
  {
    id: "prod-9",
    shopId: "shop-3",
    name: "Croissant",
    price: 60,
    isAvailable: false,
    image: "/golden-croissant.png",
  },
  // Tech Corner Products
  {
    id: "prod-10",
    shopId: "shop-4",
    name: "USB Cable (Type-C)",
    price: 250,
    isAvailable: true,
    image: "/usb-cable.png",
  },
  {
    id: "prod-11",
    shopId: "shop-4",
    name: "Phone Case",
    price: 399,
    isAvailable: true,
    image: "/colorful-phone-case-display.png",
  },
  // Pages & Pens Products
  {
    id: "prod-12",
    shopId: "shop-5",
    name: "Notebook (A4)",
    price: 120,
    isAvailable: true,
    image: "/open-notebook-desk.png",
  },
  {
    id: "prod-13",
    shopId: "shop-5",
    name: "Pen Set",
    price: 180,
    isAvailable: true,
    image: "/elegant-pen-set.png",
  },
]

export function getShopsByApartment(apartmentId: string) {
  return shops.filter((shop) => shop.isApproved && shop.apartmentIds.includes(apartmentId))
}

export function getProductsByShop(shopId: string) {
  return products.filter((product) => product.shopId === shopId)
}

export function getShopById(shopId: string) {
  return shops.find((shop) => shop.id === shopId)
}

export function getApartmentById(apartmentId: string) {
  return apartments.find((apt) => apt.id === apartmentId)
}
