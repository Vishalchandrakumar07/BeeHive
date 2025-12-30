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
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Settings } from "lucide-react"
import { createClient } from "@/lib/client"
import { useRouter } from "next/navigation"

interface Shop {
  id: string
  name: string
}

interface Apartment {
  id: string
  name: string
}

interface AssignShopDialogProps {
  shop: Shop
  apartments: Apartment[]
  currentApartments: Apartment[]
}

export function AssignShopDialog({ shop, apartments, currentApartments }: AssignShopDialogProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedApartments, setSelectedApartments] = useState<string[]>(currentApartments.map((apt) => apt.id) || [])
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
      console.log("[v0] Updating shop apartments:", shop.id, selectedApartments)

      const { error: deleteError } = await supabase.from("shop_apartments").delete().eq("shop_id", shop.id)

      if (deleteError) throw deleteError

      if (selectedApartments.length > 0) {
        const associations = selectedApartments.map((aptId) => ({
          shop_id: shop.id,
          apartment_id: aptId,
        }))

        const { error: insertError } = await supabase.from("shop_apartments").insert(associations)

        if (insertError) throw insertError
      }

      console.log("[v0] Shop apartments updated successfully")
      setIsOpen(false)
      router.refresh()
    } catch (error: unknown) {
      console.error("[v0] Error updating shop apartments:", error)
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost">
          <Settings className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Shop: {shop.name}</DialogTitle>
          <DialogDescription>Assign apartments to this shop</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Assign to Apartments</Label>
            <div className="border rounded-lg p-3 max-h-64 overflow-y-auto space-y-2 mt-2">
              {apartments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No apartments available</p>
              ) : (
                apartments.map((apartment) => (
                  <div key={apartment.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={apartment.id}
                      checked={selectedApartments.includes(apartment.id)}
                      onCheckedChange={() => toggleApartment(apartment.id)}
                    />
                    <label htmlFor={apartment.id} className="text-sm cursor-pointer flex-1">
                      {apartment.name}
                    </label>
                  </div>
                ))
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Selected: {selectedApartments.length} apartment(s)</p>
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
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
