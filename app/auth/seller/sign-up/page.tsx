"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Store, ArrowLeft } from "lucide-react"
import { supabase } from "@/lib/client"

interface Apartment {
  id: string
  name: string
  address: string
}

export default function SellerSignUpPage() {
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [shopName, setShopName] = useState("")
  const [serviceProviderName, setServiceProviderName] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [selectedApartments, setSelectedApartments] = useState<string[]>([])
  const [availableDays, setAvailableDays] = useState<string[]>([])
  const [timeStart, setTimeStart] = useState("09:00")
  const [timeEnd, setTimeEnd] = useState("18:00")
  const [apartments, setApartments] = useState<Apartment[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  useEffect(() => {
    const fetchApartments = async () => {
      const { data, error } = await supabase.from("apartments").select("id, name, address").order("name")

      if (error) {
        console.error("[v0] Error fetching apartments:", error)
      } else {
        setApartments(data || [])
      }
    }

    fetchApartments()
  }, [])

  const toggleDay = (day: string) => {
    setAvailableDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]))
  }

  const toggleApartment = (apartmentId: string) => {
    setSelectedApartments((prev) =>
      prev.includes(apartmentId) ? prev.filter((id) => id !== apartmentId) : [...prev, apartmentId],
    )
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { data: existingSeller, error: checkError } = await supabase
        .from("sellers")
        .select("id")
        .eq("phone", phone)
        .single()

      if (existingSeller) {
        setError("Phone number already exists. Please use a different phone number.")
        setIsLoading(false)
        return
      }

      if (checkError && checkError.code !== "PGRST116") {
        // PGRST116 means no rows found, which is what we want
        throw checkError
      }

      const bcrypt = await import("bcryptjs")
      const passwordHash = await bcrypt.hash(password, 10)

      const { data: seller, error: sellerError } = await supabase
        .from("sellers")
        .insert({
          phone,
          password_hash: passwordHash,
          service_provider_name: serviceProviderName,
        })
        .select()
        .single()

      if (sellerError) {
        console.error("[v0] Seller creation error:", sellerError)
        throw sellerError
      }

      console.log("[v0] Seller created:", seller.id)

      const { data: shop, error: shopError } = await supabase
        .from("shops")
        .insert({
          name: shopName,
          description: description,
          category: category,
          phone: phone,
          seller_id: seller.id,
          service_provider_name: serviceProviderName,
          available_days: availableDays,
          available_time_start: timeStart,
          available_time_end: timeEnd,
          is_active: false, // Needs admin approval
        })
        .select()
        .single()

      if (shopError) {
        console.error("[v0] Shop creation error:", shopError)
        throw shopError
      }

      console.log("[v0] Shop created:", shop.id)

      if (selectedApartments.length > 0) {
        const associations = selectedApartments.map((aptId) => ({
          shop_id: shop.id,
          apartment_id: aptId,
        }))

        const { error: assocError } = await supabase.from("shop_apartments").insert(associations)

        if (assocError) {
          console.error("[v0] Association error:", assocError)
        }
      }

      router.push("/auth/seller/login?registered=true")
    } catch (error: unknown) {
      console.error("[v0] Final error:", error)
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-gradient-to-br from-primary/5 via-background to-primary/10">
      <div className="w-full max-w-2xl">
        <div className="mb-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>

        <Card className="border-2">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <Store className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Register as Service Provider</CardTitle>
            <CardDescription>Create an account to start selling products or providing services</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp}>
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="shopName">Shop Name *</Label>
                  <Input
                    id="shopName"
                    type="text"
                    placeholder="My Shop"
                    required
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="serviceProviderName">Service Provider Name *</Label>
                  <Input
                    id="serviceProviderName"
                    type="text"
                    placeholder="Your name"
                    required
                    value={serviceProviderName}
                    onChange={(e) => setServiceProviderName(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Car">Car Service</SelectItem>
                      <SelectItem value="RO">RO Service</SelectItem>
                      <SelectItem value="AC">AC Service</SelectItem>
                      <SelectItem value="Interior">Interior Design</SelectItem>
                      <SelectItem value="Grocery">Grocery</SelectItem>
                      <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                      <SelectItem value="Bakery">Bakery</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>Nearby Apartments * (Select at least one)</Label>
                  <div className="border rounded-lg p-3 max-h-48 overflow-y-auto space-y-2">
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
                            {apartment.name} - {apartment.address}
                          </label>
                        </div>
                      ))
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Select the apartments your shop serves or is located near
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Tell customers about your shop or services..."
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Available Days *</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {days.map((day) => (
                      <div key={day} className="flex items-center space-x-2">
                        <Checkbox
                          id={day}
                          checked={availableDays.includes(day)}
                          onCheckedChange={() => toggleDay(day)}
                        />
                        <label htmlFor={day} className="text-sm cursor-pointer">
                          {day}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="timeStart">Opening Time</Label>
                    <Input
                      id="timeStart"
                      type="time"
                      value={timeStart}
                      onChange={(e) => setTimeStart(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="timeEnd">Closing Time</Label>
                    <Input id="timeEnd" type="time" value={timeEnd} onChange={(e) => setTimeEnd(e.target.value)} />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1234567890"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">At least 6 characters</p>
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}

                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </div>

              <div className="mt-6 text-center text-sm">
                Already have an account?{" "}
                <Link href="/auth/seller/login" className="text-primary font-medium hover:underline">
                  Login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
