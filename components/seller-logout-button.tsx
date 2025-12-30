"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

export function SellerLogoutButton() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("seller_phone")
    localStorage.removeItem("seller_id")
    localStorage.removeItem("seller_type")

    console.log("[v0] Seller logged out, redirecting to login")
    router.push("/auth/seller/login")
    router.refresh()
  }

  return (
    <Button variant="outline" size="sm" onClick={handleLogout}>
      <LogOut className="w-4 h-4 mr-2" />
      Logout
    </Button>
  )
}
