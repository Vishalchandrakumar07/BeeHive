"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

interface FlatNumberFormProps {
  apartment: {
    id: string
    name: string
    address: string
  }
}

export function FlatNumberForm({ apartment }: FlatNumberFormProps) {
  const [flatNumber, setFlatNumber] = useState("")
  const [isConfirmed, setIsConfirmed] = useState(false)

  useEffect(() => {
    const savedFlatNumber = localStorage.getItem(`flatNumber-${apartment.id}`)
    if (savedFlatNumber) {
      setFlatNumber(savedFlatNumber)
      setIsConfirmed(true)
    }
  }, [apartment.id])

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault()
    if (flatNumber.trim()) {
      localStorage.setItem(`flatNumber-${apartment.id}`, flatNumber)
      localStorage.setItem("apartmentId", apartment.id)
      localStorage.setItem("apartmentName", apartment.name)
      setIsConfirmed(true)
    }
  }

  if (isConfirmed) return null

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      <header className="border-b border-border bg-card">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ChevronLeft className="w-4 h-4" />
            Back
          </Link>
        </div>
      </header>

      <main className="flex-1 container max-w-md mx-auto px-4 py-12 flex items-center justify-center">
        <Card className="w-full">
          <CardContent className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-medium mb-2 text-foreground">{apartment.name}</h2>
              <p className="text-sm text-muted-foreground">{apartment.address}</p>
            </div>

            <form onSubmit={handleConfirm}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="flatNumber" className="text-sm font-medium">
                    Enter Your Flat Number
                  </Label>
                  <Input
                    id="flatNumber"
                    type="text"
                    placeholder="e.g., A-101"
                    value={flatNumber}
                    onChange={(e) => setFlatNumber(e.target.value)}
                    className="mt-2"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Continue
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
