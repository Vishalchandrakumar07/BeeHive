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

interface EditProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: any
  onSaved?: () => void
}

export function EditProductDialog({ open, onOpenChange, product, onSaved }: EditProductDialogProps) {
  const [name, setName] = useState(product.name)
  const [description, setDescription] = useState(product.description || "")
  const [price, setPrice] = useState(product.price.toString())
  const [isAvailable, setIsAvailable] = useState(product.is_available)
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    const supabase = createClient()
    setIsLoading(true)

    try {
      const { error } = await supabase
        .from("products")
        .update({
          name,
          description: description || null,
          price: Number.parseFloat(price),
          is_available: isAvailable,
        })
        .eq("id", product.id)

      if (error) throw error

      toast.success("Product updated successfully")
      onOpenChange(false)
      onSaved?.()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update product")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>Update your product details</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="edit-prod-name">Product Name</Label>
            <Input id="edit-prod-name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="edit-prod-description">Description</Label>
            <Textarea
              id="edit-prod-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="edit-prod-price">Price (₹)</Label>
            <Input
              id="edit-prod-price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              step="0.01"
              className="mt-1"
            />
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <Label htmlFor="edit-prod-available">Available for Sale</Label>
            <Switch id="edit-prod-available" checked={isAvailable} onCheckedChange={setIsAvailable} />
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
