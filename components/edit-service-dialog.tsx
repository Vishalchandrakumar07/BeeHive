"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { createClient } from "@/lib/client"
import { toast } from "sonner"

interface EditServiceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  service: any
  onSaved?: () => void
}

export function EditServiceDialog({ open, onOpenChange, service, onSaved }: EditServiceDialogProps) {
  const [name, setName] = useState(service.name)
  const [description, setDescription] = useState(service.description || "")
  const [price, setPrice] = useState(service.price.toString())
  const [isAvailable, setIsAvailable] = useState(service.is_available)
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    const supabase = createClient()
    setIsLoading(true)

    try {
      const { error } = await supabase
        .from("services")
        .update({
          name,
          description,
          price: Number.parseFloat(price),
          is_available: isAvailable,
        })
        .eq("id", service.id)

      if (error) throw error

      toast.success("Service updated successfully")
      onOpenChange(false)
      onSaved?.()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update service")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Service</DialogTitle>
          <DialogDescription>Update your service details</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="edit-name">Service Name</Label>
            <Input id="edit-name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="edit-price">Price (₹)</Label>
            <Input
              id="edit-price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              step="0.01"
              className="mt-1"
            />
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <Label htmlFor="edit-available">Available for Booking</Label>
            <Switch id="edit-available" checked={isAvailable} onCheckedChange={setIsAvailable} />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
