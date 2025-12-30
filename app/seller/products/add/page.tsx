"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/client"
import { AddProductForm } from "@/components/add-product-form"

export default function AddProductPage() {
  const [shopId, setShopId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const phone = localStorage.getItem("seller_phone")

      console.log("[v0] Add Product: checking seller phone", phone ? "found" : "not found")

      if (!phone) {
        router.push("/auth/seller/login")
        return
      }

      const { data: seller, error } = await supabase.from("sellers").select("*").eq("phone", phone).single()

      if (error || !seller) {
        console.error("[v0] Add Product: seller not found", error)
        router.push("/auth/seller/login")
        return
      }

      if (seller.seller_type !== "products") {
        console.log("[v0] Add Product: wrong seller type, redirecting to dashboard")
        router.push("/seller/dashboard")
        return
      }

      const { data: shop } = await supabase.from("shops").select("id").eq("seller_id", seller.id).single()

      if (!shop) {
        console.log("[v0] Add Product: no shop found, redirecting to dashboard")
        router.push("/seller/dashboard")
        return
      }

      console.log("[v0] Add Product: authorized, shop_id:", shop.id)
      setShopId(shop.id)
      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!shopId) return null

  return <AddProductForm shopId={shopId} />
}
