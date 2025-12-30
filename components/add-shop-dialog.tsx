"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus } from "lucide-react"
import { createClient } from "@/lib/client"
import { useRouter } from "next/navigation"

interface Apartment {
  id: string
  name: string
}

interface AddShopDialogProps {
  apartments: Apartment[]
}

export function AddShopDialog({ apartments }: AddShopDialogProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [shopName, setShopName] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [phone, setPhone] = useState("")
  const [selectedApartments, setSelectedApartments] = useState<string[]>([])
  const [isActive, setIsActive] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const toggleApartment = (apartmentId: string) => {
    setSelectedApartments((prev) =>
      prev.includes(apartmentId) ? prev.filter((id) => id !== apartmentId) : [...prev, apartmentId],
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      console.log("[v0] Creating shop manually from admin")

      const { data: shop, error: shopError } = await supabase
        .from("shops")
        .insert({
          name: shopName,
          category: category,
          description: description || null,
          phone: phone,
          is_active: isActive,
          owner_id: null,
        })
        .select()
        .single()

      if (shopError) throw shopError

      console.log("[v0] Shop created:", shop.id)

      if (selectedApartments.length > 0) {
        const associations = selectedApartments.map((aptId) => ({
          shop_id: shop.id,
          apartment_id: aptId,
        }))

        const { error: assocError } = await supabase.from("shop_apartments").insert(associations)

        if (assocError) throw assocError

        console.log("[v0] Shop apartments associated")
      }

      // Reset form
      setShopName("")
      setCategory("")
      setDescription("")
      setPhone("")
      setSelectedApartments([])
      setIsActive(true)

      setIsOpen(false)
      router.refresh()
    } catch (error: unknown) {
      console.error("[v0] Error creating shop:", error)
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Shop
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Shop</DialogTitle>
          <DialogDescription>Manually create a new shop in the system</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="shopName">Shop Name *</Label>
            <Input
              id="shopName"
              type="text"
              placeholder="My Shop"
              required
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="category">Category *</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Grocery">Grocery</SelectItem>
                <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                <SelectItem value="Bakery">Bakery</SelectItem>
                <SelectItem value="Stationery">Stationery</SelectItem>
                <SelectItem value="Electronics">Electronics</SelectItem>
                <SelectItem value="Clothing">Clothing</SelectItem>
                <SelectItem value="Car">Car Service</SelectItem>
                <SelectItem value="RO">RO Service</SelectItem>
                <SelectItem value="AC">AC Service</SelectItem>
                <SelectItem value="Interior">Interior Design</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the shop..."
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1234567890"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-2"
            />
          </div>

          <div>
            <Label>Assign to Apartments</Label>
            <div className="border rounded-lg p-3 max-h-48 overflow-y-auto space-y-2 mt-2">
              {apartments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No apartments available</p>
              ) : (
                apartments.map((apartment) => (
                  <div key={apartment.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`new-${apartment.id}`}
                      checked={selectedApartments.includes(apartment.id)}
                      onCheckedChange={() => toggleApartment(apartment.id)}
                    />
                    <label htmlFor={`new-${apartment.id}`} className="text-sm cursor-pointer flex-1">
                      {apartment.name}
                    </label>
                  </div>
                ))
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Selected: {selectedApartments.length} apartment(s)</p>
          </div>

          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <Label htmlFor="active" className="font-medium">
                Active Status
              </Label>
              <p className="text-sm text-muted-foreground">Enable this shop to appear in listings</p>
            </div>
            <Switch id="active" checked={isActive} onCheckedChange={setIsActive} />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Shop"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
