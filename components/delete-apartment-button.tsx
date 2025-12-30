"use client"

import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { createClient } from "@/lib/client"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface DeleteApartmentButtonProps {
  apartmentId: string
  apartmentName: string
}

export function DeleteApartmentButton({ apartmentId, apartmentName }: DeleteApartmentButtonProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${apartmentName}? This will also delete all associated shops.`)) {
      return
    }

    setIsDeleting(true)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("apartments").delete().eq("id", apartmentId)

      if (error) throw error

      router.refresh()
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Failed to delete apartment")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Button size="sm" variant="ghost" onClick={handleDelete} disabled={isDeleting}>
      <Trash2 className="w-4 h-4" />
    </Button>
  )
}
