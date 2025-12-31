"use client"

import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { createClient } from "@/lib/client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface DeleteShopButtonProps {
  shopId: string
  shopName: string
}

export function DeleteShopButton({ shopId, shopName }: DeleteShopButtonProps) {
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${shopName}"? This cannot be undone.`)) {
      return
    }

    const supabase = createClient()

    try {
      // Delete associated shop_apartments records first
      await supabase.from("shop_apartments").delete().eq("shop_id", shopId)

      // Then delete the shop
      const { error } = await supabase.from("shops").delete().eq("id", shopId)

      if (error) throw error

      toast.success("Shop deleted successfully!")
      router.refresh()
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to delete shop"
      toast.error(errorMsg)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDelete}
      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  )
}
