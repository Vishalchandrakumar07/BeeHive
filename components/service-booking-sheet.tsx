"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/client"
import { toast } from "sonner"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"

interface ServiceBookingSheetProps {
  isOpen: boolean
  onClose: () => void
  serviceName: string
  servicePrice: number
  shopPhone: string
  shopName: string
  serviceId: string
  shopId: string
}

export function ServiceBookingSheet({
  isOpen,
  onClose,
  serviceName,
  servicePrice,
  shopPhone,
  shopName,
  serviceId,
  shopId,
}: ServiceBookingSheetProps) {
  const [loading, setLoading] = useState(false)
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [apartmentName, setApartmentName] = useState(() => localStorage.getItem("apartmentName") || "")
  const [flatNumber, setFlatNumber] = useState("")
  const [doorNumber, setDoorNumber] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [notes, setNotes] = useState("") // Declare the notes variable

  const supabase = createClient()

  const handleSubmitBooking = async () => {
    if (!customerName || !customerPhone) {
      toast.error("Please enter your name and phone number")
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.from("bookings").insert({
        service_id: serviceId,
        shop_id: shopId,
        customer_name: customerName,
        customer_phone: customerPhone,
        quantity,
        apartment_name: apartmentName,
        flat_number: flatNumber,
        door_number: doorNumber,
        booking_status: "pending",
      })

      if (error) throw error

      const message = `Hi ${shopName}, I would like to book: ${serviceName} (Qty: ${quantity})\n\nDelivery Address:\nApartment: ${apartmentName}\nFlat/Unit: ${flatNumber || "N/A"}\nDoor No: ${doorNumber || "N/A"}\n\nMy details:\nName: ${customerName}\nPhone: ${customerPhone}\n\nAdditional Notes:\n${notes}`
      const whatsappUrl = `https://wa.me/${shopPhone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, "_blank")

      toast.success("Booking submitted! Opening WhatsApp...")
      setCustomerName("")
      setCustomerPhone("")
      setFlatNumber("")
      setDoorNumber("")
      setQuantity(1)
      setNotes("") // Reset the notes variable
      onClose()
    } catch (error) {
      console.error("Booking error:", error)
      toast.error("Failed to submit booking")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Book {serviceName}</SheetTitle>
          <SheetDescription>Fill in your details to book this service</SheetDescription>
        </SheetHeader>

        <div className="space-y-4 mt-6">
          <div>
            <label className="text-sm font-medium text-foreground">Name *</label>
            <Input
              placeholder="Your name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Phone Number *</label>
            <Input
              placeholder="Your phone number"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="mt-1"
            />
          </div>

          <div className="pt-2 border-t border-border space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Delivery Address</h3>

            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Apartment/Society Name</label>
              <Input
                placeholder="e.g., Sunflower Heights"
                value={apartmentName}
                onChange={(e) => setApartmentName(e.target.value)}
                readOnly
                className="bg-secondary"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Flat/Unit Number</label>
              <Input placeholder="e.g., 301, A-5" value={flatNumber} onChange={(e) => setFlatNumber(e.target.value)} />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Door Number (optional)</label>
              <Input placeholder="e.g., ABC-1234" value={doorNumber} onChange={(e) => setDoorNumber(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Quantity</label>
            <div className="flex items-center gap-2 mt-1">
              <Button variant="outline" size="sm" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                -
              </Button>
              <span className="text-center min-w-[40px]">{quantity}</span>
              <Button variant="outline" size="sm" onClick={() => setQuantity(quantity + 1)}>
                +
              </Button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Additional Notes</label>
            <Textarea
              placeholder="Any special requests or details..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1 min-h-[100px]"
            />
          </div>

          <div className="bg-accent/10 p-3 rounded-lg">
            <p className="text-sm text-foreground">
              Total: <span className="font-semibold">₹{(servicePrice * quantity).toFixed(2)}</span>
            </p>
          </div>

          <Button onClick={handleSubmitBooking} disabled={loading} className="w-full" size="lg">
            {loading ? "Submitting..." : "Submit Booking via WhatsApp"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
