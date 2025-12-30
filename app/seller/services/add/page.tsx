"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/client"
import { AddServiceForm } from "@/components/add-service-form"

export default function AddServicePage() {
  const [shopId, setShopId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const phone = localStorage.getItem("seller_phone")

      console.log("[v0] Add Service: checking seller phone", phone ? "found" : "not found")

      if (!phone) {
        router.push("/auth/seller/login")
        return
      }

      const { data: seller, error } = await supabase.from("sellers").select("*").eq("phone", phone).single()

      if (error || !seller) {
        console.error("[v0] Add Service: seller not found", error)
        router.push("/auth/seller/login")
        return
      }

      if (seller.seller_type !== "services") {
        console.log("[v0] Add Service: wrong seller type, redirecting to dashboard")
        router.push("/seller/dashboard")
        return
      }

      const { data: shop } = await supabase.from("shops").select("id").eq("seller_id", seller.id).single()

      if (!shop) {
        console.log("[v0] Add Service: no shop found, redirecting to dashboard")
        router.push("/seller/dashboard")
        return
      }

      console.log("[v0] Add Service: authorized, shop_id:", shop.id)
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

  return <AddServiceForm shopId={shopId} />
}
