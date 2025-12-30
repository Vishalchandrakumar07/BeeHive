"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { X, Minus, Plus } from "lucide-react"
import { createClient } from "@/lib/client"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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
  shopId: string
  shopName: string
  onUpdateQuantity: (productId: string, delta: number) => void
}

export function CartBottomSheet({
  isOpen,
  onClose,
  cart,
  shopPhone,
  shopId,
  shopName,
  onUpdateQuantity,
}: CartBottomSheetProps) {
  const supabase = createClient()

  const [apartmentName, setApartmentName] = useState("")
  const [flatNumber, setFlatNumber] = useState("")
  const [doorNumber, setDoorNumber] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const storedApartment = localStorage.getItem("apartmentName")
    if (storedApartment) setApartmentName(storedApartment)
  }, [])

  if (!isOpen) return null

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  const buildOrderNotes = () => {
    let notes = `Products Ordered:\n`
    cart.forEach((item) => {
      notes += `• ${item.product.name} x ${item.quantity} = ₹${(
        item.product.price * item.quantity
      ).toFixed(2)}\n`
    })
    notes += `\nTotal: ₹${totalPrice.toFixed(2)}`
    return notes
  }

  const handleOrderViaWhatsApp = async () => {
    if (!customerName || !customerPhone) {
      toast.error("Please enter your name and phone number")
      return
    }

    setLoading(true)

    try {
      // ✅ INSERT INTO BOOKINGS TABLE
      const { error } = await supabase.from("bookings").insert({
        shop_id: shopId,
        customer_name: customerName,
        customer_phone: customerPhone,
        quantity: cart.reduce((s, i) => s + i.quantity, 0),
        apartment_name: apartmentName,
        flat_number: flatNumber,
        door_number: doorNumber,
        booking_status: "pending",
        notes: buildOrderNotes(),
      })

      if (error) throw error

      // ✅ WhatsApp message
      let message = `Hi ${shopName}, I would like to place an order.\n\n`
      message += `Delivery Address:\n`
      message += `Apartment: ${apartmentName}\n`
      message += `Flat: ${flatNumber || "N/A"}\n`
      message += `Door: ${doorNumber || "N/A"}\n\n`
      message += buildOrderNotes()
      message += `\n\nCustomer:\n${customerName}\n${customerPhone}`

      const whatsappUrl = `https://wa.me/${shopPhone.replace(
        /\D/g,
        ""
      )}?text=${encodeURIComponent(message)}`

      window.open(whatsappUrl, "_blank")

      toast.success("Order placed! Opening WhatsApp...")
      onClose()
    } catch (err) {
      console.error("Booking error:", err)
      toast.error("Failed to place order")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      <div className="fixed inset-x-0 bottom-0 z-50 bg-card rounded-t-2xl max-h-[85vh] overflow-y-auto">
        <div className="container max-w-4xl mx-auto">
          <div className="sticky top-0 bg-card border-b px-4 py-4 flex justify-between">
            <h2 className="text-lg font-medium">Your Order</h2>
            <Button size="icon" variant="ghost" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="p-4 space-y-4">
            {cart.map((item) => (
              <Card key={item.product.id}>
                <CardContent className="p-3 flex gap-3">
                  <div className="w-16 h-16 bg-secondary rounded-lg overflow-hidden">
                    {item.product.image_url && (
                      <Image
                        src={item.product.image_url}
                        alt={item.product.name}
                        width={64}
                        height={64}
                        className="object-cover"
                      />
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{item.product.name}</h3>
                    <p className="text-sm">
                      ₹{item.product.price} × {item.quantity}
                    </p>

                    <div className="flex gap-2 mt-2">
                      <Button size="icon" variant="ghost" onClick={() => onUpdateQuantity(item.product.id, -1)}>
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span>{item.quantity}</span>
                      <Button size="icon" variant="ghost" onClick={() => onUpdateQuantity(item.product.id, 1)}>
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="border-t pt-4 space-y-3">
              <Label>Name *</Label>
              <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} />

              <Label>Phone *</Label>
              <Input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />

              <Label>Apartment</Label>
              <Input value={apartmentName} readOnly className="bg-secondary" />

              <Label>Flat</Label>
              <Input value={flatNumber} onChange={(e) => setFlatNumber(e.target.value)} />

              <Label>Door</Label>
              <Input value={doorNumber} onChange={(e) => setDoorNumber(e.target.value)} />
            </div>

            <div className="border-t pt-4 flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>

            <Button onClick={handleOrderViaWhatsApp} disabled={loading} size="lg" className="w-full">
              {loading ? "Placing Order..." : "Order via WhatsApp"}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
