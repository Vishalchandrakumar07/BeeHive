"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/client"
import { useRouter } from "next/navigation"

interface ToggleShopStatusProps {
  shopId: string
  isActive: boolean
}

export function ToggleShopStatus({ shopId, isActive }: ToggleShopStatusProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const toggleStatus = async () => {
    setLoading(true)
    const supabase = createClient()

    console.log("[v0] Toggling shop status:", shopId, !isActive)

    const { error } = await supabase.from("shops").update({ is_active: !isActive }).eq("id", shopId)

    if (error) {
      console.error("[v0] Error toggling shop status:", error)
    } else {
      router.refresh()
    }

    setLoading(false)
  }

  return (
    <button onClick={toggleStatus} disabled={loading} className="cursor-pointer">
      <Badge variant={isActive ? "default" : "secondary"}>{loading ? "..." : isActive ? "Active" : "Inactive"}</Badge>
    </button>
  )
}
