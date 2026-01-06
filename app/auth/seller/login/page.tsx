"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { Store, ArrowLeft } from "lucide-react"
import { createClient } from "@/lib/client"

export default function SellerLoginPage() {
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const registered = searchParams.get("registered")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    console.log("[v0] Starting Login with phone:", phone)

    try {
      const { data: seller, error: sellerError } = await supabase
        .from("sellers")
        .select("*")
        .eq("phone", phone)
        .single()

      if (sellerError || !seller) {
        console.error("[v0] Seller not found:", sellerError)
        throw new Error("Invalid phone number or password")
      }

      console.log("[v0] Found seller:", seller.id, "type:", seller.seller_type)

      const bcrypt = await import("bcryptjs")
      const isValid = await bcrypt.compare(password, seller.password_hash)

      if (!isValid) {
        console.log("[v0] Password mismatch")
        throw new Error("Invalid phone number or password")
      }

      console.log("[v0] Password verified, storing session")

      localStorage.setItem("seller_phone", phone)
      localStorage.setItem("seller_id", seller.id)
      localStorage.setItem("seller_type", seller.seller_type || "")

      console.log("[v0] Session stored, seller_type:", seller.seller_type || "not set")

      await new Promise((resolve) => setTimeout(resolve, 100))

      if (!seller.seller_type) {
        console.log("[v0] No seller type, redirecting to select-type")
        router.replace("/seller/select-type")
      } else {
        console.log("[v0] Seller type exists, redirecting to dashboard")
        router.replace("/seller/dashboard")
      }
    } catch (error: unknown) {
      console.error("[v0] Login error:", error)
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-gradient-to-br from-primary/5 via-background to-primary/10">
      <div className="w-full max-w-md">
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
            <CardTitle className="text-2xl font-bold">Service Provider Login</CardTitle>
            <CardDescription>Access your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            {registered && (
              <div className="mb-4 p-3 rounded-lg bg-accent/10 border border-accent/20">
                <p className="text-sm text-accent">Registration successful! Please wait for admin approval.</p>
              </div>
            )}
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
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
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}
                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </div>
              <div className="mt-6 text-center text-sm">
                Don't have an account?{" "}
                <Link href="/auth/seller/sign-up" className="text-primary font-medium hover:underline">
                  Sign up
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
