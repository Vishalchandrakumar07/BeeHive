"use client"

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
import { Edit2 } from "lucide-react"
import { createClient } from "@/lib/client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface Apartment {
  id: string
  name: string
  address: string
}

export function EditApartmentDialog({ apartment }: { apartment: Apartment }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(apartment.name)
  const [address, setAddress] = useState(apartment.address)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleUpdate = async () => {
    if (!name.trim() || !address.trim()) {
      toast.error("Please fill all fields")
      return
    }

    setLoading(true)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("apartments").update({ name, address }).eq("id", apartment.id)

      if (error) throw error

      toast.success("Apartment updated successfully!")
      setOpen(false)
      router.refresh()
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to update apartment"
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Edit2 className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Apartment</DialogTitle>
          <DialogDescription>Update apartment details</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Apartment Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Green Valley Apartments"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Full address"
            />
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleUpdate} disabled={loading}>
            {loading ? "Updating..." : "Update"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
