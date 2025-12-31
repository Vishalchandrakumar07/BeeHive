"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Minus, Plus } from "lucide-react"
import { useState } from "react"
import Image from "next/image"

interface Product {
  id: string
  name: string
  price: number
  image_url: string | null
}

interface CartItem {
  product: Product
  quantity: number
}

interface CartBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  cart: CartItem[]
  shopPhone: string
  shopName: string // Added shopName prop
  onUpdateQuantity: (productId: string, delta: number) => void
}

export function CartBottomSheet({
  isOpen,
  onClose,
  cart,
  shopPhone,
  shopName,
  onUpdateQuantity,
}: CartBottomSheetProps) {
  const [apartmentName, setApartmentName] = useState(() => localStorage.getItem("apartmentName") || "")
  const [flatNumber, setFlatNumber] = useState("")
  const [doorNumber, setDoorNumber] = useState("")

  if (!isOpen) return null

  const totalPrice = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  const handleOrderViaWhatsApp = () => {
    const apartmentId = localStorage.getItem("apartmentId") || ""

    let message = `Hi ${shopName},%0ANew Order from ${apartmentName}%0A` // Include shopName in greeting
    message += `Delivery Address:%0A`
    message += `Apartment: ${apartmentName}%0A`
    message += `Flat/Unit: ${flatNumber || "N/A"}%0A`
    message += `Door No: ${doorNumber || "N/A"}%0A%0A`
    message += `*Order Details:*%0A`

    cart.forEach((item) => {
      message += `• ${item.product.name} x ${item.quantity} - ₹${(item.product.price * item.quantity).toFixed(2)}%0A`
    })

    message += `%0A*Total: ₹${totalPrice.toFixed(2)}*`

    const whatsappUrl = `https://wa.me/${shopPhone.replace(/\D/g, "")}?text=${message}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40 animate-in fade-in" onClick={onClose} />
      <div className="fixed inset-x-0 bottom-0 z-50 bg-card rounded-t-2xl shadow-lg animate-in slide-in-from-bottom max-h-[85vh] overflow-y-auto">
        <div className="container max-w-4xl mx-auto">
          <div className="sticky top-0 bg-card border-b border-border px-4 py-4 flex items-center justify-between">
            <h2 className="text-lg font-medium text-foreground">Your Order</h2>
            <Button size="icon" variant="ghost" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="p-4 space-y-4">
            {cart.map((item) => (
              <Card key={item.product.id}>
                <CardContent className="p-3">
                  <div className="flex gap-3">
                    <div className="w-16 h-16 bg-secondary rounded-lg flex-shrink-0 overflow-hidden">
                      {item.product.image_url ? (
                        <Image
                          src={item.product.image_url || "/placeholder.svg"}
                          alt={item.product.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-secondary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-sm text-foreground mb-1">{item.product.name}</h3>
                      <p className="text-sm font-medium text-foreground mb-2">
                        ₹{item.product.price.toFixed(2)} × {item.quantity} = ₹
                        {(item.product.price * item.quantity).toFixed(2)}
                      </p>
                      <div className="flex items-center gap-2 bg-secondary rounded-lg p-1 w-fit">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => onUpdateQuantity(item.product.id, -1)}
                          className="h-6 w-6"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="text-sm font-medium min-w-[20px] text-center text-foreground">
                          {item.quantity}
                        </span>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => onUpdateQuantity(item.product.id, 1)}
                          className="h-6 w-6"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="pt-2 space-y-3 border-t border-border">
              <h3 className="text-sm font-semibold text-foreground">Delivery Address</h3>

              <div>
                <Label htmlFor="apartment" className="text-sm font-medium mb-1 block">
                  Apartment/Society Name
                </Label>
                <Input
                  id="apartment"
                  placeholder="e.g., Sunflower Heights"
                  value={apartmentName}
                  onChange={(e) => setApartmentName(e.target.value)}
                  readOnly
                  className="bg-secondary"
                />
              </div>

              <div>
                <Label htmlFor="flat" className="text-sm font-medium mb-1 block">
                  Flat/Unit Number
                </Label>
                <Input
                  id="flat"
                  placeholder="e.g., 301, A-5"
                  value={flatNumber}
                  onChange={(e) => setFlatNumber(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="door" className="text-sm font-medium mb-1 block">
                  Door Number (optional)
                </Label>
                <Input
                  id="door"
                  placeholder="e.g., ABC-1234"
                  value={doorNumber}
                  onChange={(e) => setDoorNumber(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-2 border-t border-border">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-medium text-foreground">Total</span>
                <span className="text-xl font-semibold text-foreground">₹{totalPrice.toFixed(2)}</span>
              </div>
              <Button onClick={handleOrderViaWhatsApp} className="w-full" size="lg">
                Order via WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
