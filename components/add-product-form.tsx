"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, Upload } from "lucide-react"
import { createClient } from "@/lib/client"
import { toast } from "sonner"

interface AddProductFormProps {
  shopId: string
}

export function AddProductForm({ shopId }: AddProductFormProps) {
  const router = useRouter()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isAvailable, setIsAvailable] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      let imageUrl: string | null = null

      if (imageFile) {
        const fileName = `product-${Date.now()}-${imageFile.name}`
        const { data, error: uploadError } = await supabase.storage.from("product-images").upload(fileName, imageFile)

        if (uploadError) throw uploadError

        const {
          data: { publicUrl },
        } = supabase.storage.from("product-images").getPublicUrl(fileName)
        imageUrl = publicUrl
      }

      const { error } = await supabase.from("products").insert({
        shop_id: shopId,
        name,
        description: description || null,
        price: Number.parseFloat(price),
        image_url: imageUrl,
        is_available: isAvailable,
      })

      if (error) {
        console.error("[v0] Insert error details:", error)
        // If RLS policy error, provide helpful message
        if (error.message.includes("row-level security")) {
          throw new Error("Unable to add product. Please check seller permissions or contact admin.")
        }
        throw error
      }

      toast.success("Product added successfully!")
      router.push("/seller/dashboard")
      router.refresh()
    } catch (error: unknown) {
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
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <Link
            href="/seller/dashboard"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="flex-1 container max-w-2xl mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle>Add New Product</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="e.g., Fresh Milk (1L)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Product description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-2"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="price">Price (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="e.g., 60"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="mt-2"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <Label htmlFor="image">Product Image</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors mt-2">
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

              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <Label htmlFor="availability" className="font-medium">
                    Available for Sale
                  </Label>
                  <p className="text-sm text-muted-foreground">Show this product to customers</p>
                </div>
                <Switch id="availability" checked={isAvailable} onCheckedChange={setIsAvailable} />
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/seller/dashboard")}
                  className="flex-1"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? "Adding..." : "Add Product"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
