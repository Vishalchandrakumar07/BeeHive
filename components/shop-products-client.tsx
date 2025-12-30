"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, Minus, Plus, ShoppingBag } from "lucide-react"
import { CartBottomSheet } from "@/components/cart-bottom-sheet"
import { ServiceBookingSheet } from "@/components/service-booking-sheet"
import Image from "next/image"

interface Product {
  id: string
  shop_id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  is_available: boolean
}

interface Service {
  id: string
  shop_id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  is_available: boolean
}

interface Shop {
  id: string
  name: string
  category: string
  phone: string
  is_active: boolean
  sellers?: {
    seller_type: string
  }
}

interface CartItem {
  product: Product
  quantity: number
}

interface ShopProductsClientProps {
  shop: Shop
  products: Product[]
  services: Service[]
  apartmentId: string
}

export function ShopProductsClient({ shop, products, services, apartmentId }: ShopProductsClientProps) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [isServiceOpen, setIsServiceOpen] = useState(false)

  const isServiceProvider = shop.sellers?.seller_type === "services"

  useEffect(() => {
    const savedCart = localStorage.getItem(`cart-${shop.id}`)
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [shop.id])

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem(`cart-${shop.id}`, JSON.stringify(cart))
    } else {
      localStorage.removeItem(`cart-${shop.id}`)
    }
  }, [cart, shop.id])

  const getQuantity = (productId: string) => {
    const item = cart.find((item) => item.product.id === productId)
    return item?.quantity || 0
  }

  const updateQuantity = (productId: string, delta: number) => {
    const product = products.find((p) => p.id === productId)
    if (!product) return

    const currentQuantity = getQuantity(productId)
    const newQuantity = Math.max(0, currentQuantity + delta)

    if (newQuantity === 0) {
      setCart(cart.filter((item) => item.product.id !== productId))
    } else {
      const existingIndex = cart.findIndex((item) => item.product.id === productId)
      if (existingIndex >= 0) {
        const newCart = [...cart]
        newCart[existingIndex] = { ...newCart[existingIndex], quantity: newQuantity }
        setCart(newCart)
      } else {
        setCart([...cart, { product, quantity: newQuantity }])
      }
    }
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  return (
    <div className="min-h-screen flex flex-col pb-24">
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href={`/customer/${apartmentId}`}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Link>
          </div>
          <div className="mt-3">
            <h1 className="text-xl font-medium text-foreground">{shop.name}</h1>
            <p className="text-sm text-muted-foreground">{shop.category}</p>
          </div>
        </div>
      </header>

      <main className="flex-1 container max-w-4xl mx-auto px-4 py-6">
        {isServiceProvider ? (
          services.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No services available</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {services.map((service) => (
                <Card key={service.id} className={!service.is_available ? "opacity-60" : ""}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 bg-secondary rounded-lg flex-shrink-0 overflow-hidden">
                        {service.image_url ? (
                          <Image
                            src={service.image_url || "/placeholder.svg"}
                            alt={service.name}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-secondary">
                            <ShoppingBag className="w-8 h-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground mb-1">{service.name}</h3>
                        {service.description && (
                          <p className="text-xs text-muted-foreground mb-1 line-clamp-1">{service.description}</p>
                        )}
                        <p className="text-lg font-semibold text-foreground mb-2">₹{service.price.toFixed(2)}</p>
                        {!service.is_available && <p className="text-xs text-muted-foreground mb-2">Not available</p>}
                        {service.is_available && (
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedService(service)
                              setIsServiceOpen(true)
                            }}
                            className="h-8"
                          >
                            Book Now
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products available</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {products.map((product) => {
              const quantity = getQuantity(product.id)
              return (
                <Card key={product.id} className={!product.is_available ? "opacity-60" : ""}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 bg-secondary rounded-lg flex-shrink-0 overflow-hidden">
                        {product.image_url ? (
                          <Image
                            src={product.image_url || "/placeholder.svg"}
                            alt={product.name}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-secondary">
                            <ShoppingBag className="w-8 h-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground mb-1">{product.name}</h3>
                        {product.description && (
                          <p className="text-xs text-muted-foreground mb-1 line-clamp-1">{product.description}</p>
                        )}
                        <p className="text-lg font-semibold text-foreground mb-2">₹{product.price.toFixed(2)}</p>
                        {!product.is_available && <p className="text-xs text-muted-foreground mb-2">Out of stock</p>}
                        {product.is_available && (
                          <div className="flex items-center gap-2">
                            {quantity === 0 ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateQuantity(product.id, 1)}
                                className="h-8"
                              >
                                Add
                              </Button>
                            ) : (
                              <div className="flex items-center gap-2 bg-secondary rounded-lg p-1">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => updateQuantity(product.id, -1)}
                                  className="h-6 w-6"
                                >
                                  <Minus className="w-3 h-3" />
                                </Button>
                                <span className="text-sm font-medium min-w-[20px] text-center text-foreground">
                                  {quantity}
                                </span>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => updateQuantity(product.id, 1)}
                                  className="h-6 w-6"
                                >
                                  <Plus className="w-3 h-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </main>

      {!isServiceProvider && totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-card p-4 z-20">
          <div className="container max-w-4xl mx-auto">
            <Button onClick={() => setIsCartOpen(true)} className="w-full" size="lg">
              <div className="flex items-center justify-between w-full">
                <span>
                  {totalItems} {totalItems === 1 ? "item" : "items"}
                </span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
            </Button>
          </div>
        </div>
      )}

      {selectedService && (
        <ServiceBookingSheet
          isOpen={isServiceOpen}
          onClose={() => {
            setIsServiceOpen(false)
            setSelectedService(null)
          }}
          serviceName={selectedService.name}
          servicePrice={selectedService.price}
          shopPhone={shop.phone}
          shopName={shop.name}
          serviceId={selectedService.id}
          shopId={shop.id}
        />
      )}

      <CartBottomSheet
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        shopPhone={shop.phone}
        onUpdateQuantity={updateQuantity}
      />
    </div>
  )
}
