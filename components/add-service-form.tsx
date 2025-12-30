"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Wrench, Upload } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/client"
import { toast } from "sonner"

export function AddServiceForm({ shopId }: { shopId: string }) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isAvailable, setIsAvailable] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      let imageUrl: string | null = null

      if (imageFile) {
        const fileName = `service-${Date.now()}-${imageFile.name}`
        const { data, error: uploadError } = await supabase.storage.from("service-images").upload(fileName, imageFile)

        if (uploadError) throw uploadError

        const {
          data: { publicUrl },
        } = supabase.storage.from("service-images").getPublicUrl(fileName)
        imageUrl = publicUrl
      }

      const { error: insertError } = await supabase.from("services").insert({
        shop_id: shopId,
        name,
        description,
        price: Number.parseFloat(price),
        image_url: imageUrl,
        is_available: isAvailable,
      })

      if (insertError) throw insertError

      toast.success("Service added successfully!")
      router.push("/seller/dashboard")
      router.refresh()
    } catch (error: unknown) {
      console.error("[v0] Error adding service:", error)
      const errorMsg = error instanceof Error ? error.message : "An error occurred"
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border bg-card">
        <div className="container max-w-2xl mx-auto px-4 py-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/seller/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 container max-w-2xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="w-5 h-5" />
              Add New Service
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Service Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., AC Repair & Maintenance"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your service..."
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="price">Price (₹) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="image">Service Image</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                  <input id="image" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  <label htmlFor="image" className="cursor-pointer block">
                    {imagePreview ? (
                      <div className="space-y-2">
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="Preview"
                          className="w-32 h-32 mx-auto object-cover rounded"
                        />
                        <p className="text-sm text-muted-foreground">Click to change image</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label htmlFor="available" className="font-medium">
                    Available for Booking
                  </Label>
                  <p className="text-sm text-muted-foreground">Service is active and can be booked</p>
                </div>
                <Switch id="available" checked={isAvailable} onCheckedChange={setIsAvailable} />
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Adding Service..." : "Add Service"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
