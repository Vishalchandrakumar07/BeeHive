"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, Wrench } from "lucide-react"
import { createClient } from "@/lib/client"

export default function SelectTypePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleTypeSelection = async (type: "products" | "services") => {
    setIsLoading(true)
    setError(null)
    const supabase = createClient()

    try {
      const phone = localStorage.getItem("seller_phone")
      console.log("[v0] Select type - phone from localStorage:", phone ? "found" : "not found")

      if (!phone) {
        console.log("[v0] No phone in localStorage, redirecting to login")
        router.push("/auth/seller/login")
        return
      }

      console.log("[v0] Updating seller type to:", type)
      const { error: updateError } = await supabase.from("sellers").update({ seller_type: type }).eq("phone", phone)

      if (updateError) {
        console.error("[v0] Update error:", updateError)
        throw updateError
      }

      console.log("[v0] Seller type updated successfully")
      localStorage.setItem("seller_type", type)
      console.log("[v0] Redirecting to dashboard")
      router.replace("/seller/dashboard")
    } catch (error: unknown) {
      console.error("[v0] Error setting seller type:", error)
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-gradient-to-br from-primary/5 via-background to-primary/10">
      <div className="w-full max-w-4xl">
        <Card className="border-2">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold">Choose Your Business Type</CardTitle>
            <CardDescription>Select how you want to use the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <Card
                className="cursor-pointer hover:border-primary transition-colors border-2"
                onClick={() => !isLoading && handleTypeSelection("products")}
              >
                <CardContent className="p-8 text-center">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                    <Package className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Selling Products</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    For selling physical items like groceries, medicines, bakery items, etc.
                  </p>
                  <Button className="w-full" disabled={isLoading}>
                    Select Products
                  </Button>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer hover:border-primary transition-colors border-2"
                onClick={() => !isLoading && handleTypeSelection("services")}
              >
                <CardContent className="p-8 text-center">
                  <div className="mx-auto w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-4">
                    <Wrench className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Providing Services</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    For offering services like car repair, AC service, RO maintenance, interior design, etc.
                  </p>
                  <Button className="w-full" disabled={isLoading}>
                    Select Services
                  </Button>
                </CardContent>
              </Card>
            </div>

            {error && (
              <div className="mt-6 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive text-center">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
