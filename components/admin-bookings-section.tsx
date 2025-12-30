"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle2, Clock, MapPin } from "lucide-react"

interface Booking {
  id: string
  service_id: string
  shop_id: string
  customer_name: string
  customer_phone: string
  quantity: number
  notes: string | null
  apartment_name: string | null
  flat_number: string | null
  door_number: string | null
  booking_status: string
  created_at: string
  services?: {
    name: string
    price: number
  }
  shops?: {
    name: string
  }
}

export function AdminBookingsSection() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setError(null)
        const { data, error: supabaseError } = await supabase
          .from("bookings")
          .select(`
            id,
            service_id,
            shop_id,
            customer_name,
            customer_phone,
            quantity,
            notes,
            apartment_name,
            flat_number,
            door_number,
            booking_status,
            created_at,
            services(name, price),
            shops(name)
          `)
          .order("created_at", { ascending: false })

        if (supabaseError) {
          console.error("[v0] Supabase error:", supabaseError.message, supabaseError.code)
          setError(supabaseError.message || "Failed to fetch bookings")
          throw supabaseError
        }

        if (!data) {
          console.error("[v0] No data returned from bookings query")
          setError("No data returned")
          setBookings([])
        } else {
          console.log("[v0] Bookings fetched successfully:", data.length)
          setBookings(data)
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        console.error("[v0] Error fetching bookings:", errorMessage)
        setError(errorMessage)
        setBookings([])
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()

    const subscription = supabase
      .channel("public:bookings")
      .on("postgres_changes", { event: "*", schema: "public", table: "bookings" }, (payload) => {
        console.log("[v0] Booking change detected:", payload.eventType)
        fetchBookings()
      })
      .subscribe((status) => {
        console.log("[v0] Subscription status:", status)
      })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString)
    return {
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      time: date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    }
  }

  // const getStatusIcon = (status: string) => {
  //   switch (status) {
  //     case "pending":
  //       return <Clock className="w-4 h-4" />
  //     case "confirmed":
  //       return <CheckCircle2 className="w-4 h-4" />
  //     case "cancelled":
  //       return <AlertCircle className="w-4 h-4" />
  //     default:
  //       return null
  //   }
  // }

  // const getStatusColor = (status: string) => {
  //   switch (status) {
  //     case "pending":
  //       return "bg-yellow-100 text-yellow-800"
  //     case "confirmed":
  //       return "bg-green-100 text-green-800"
  //     case "cancelled":
  //       return "bg-red-100 text-red-800"
  //     default:
  //       return "bg-gray-100 text-gray-800"
  //   }
  // }

  const BookingCard = ({ booking }: { booking: Booking }) => {
    const { date, time } = formatDateTime(booking.created_at)

    return (
      <div className="border border-border rounded-lg p-4 hover:bg-accent/5 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0 space-y-2">
            <h4 className="font-semibold text-foreground text-lg">{booking.services?.name}</h4>
            <p className="text-sm text-muted-foreground">
              From: <span className="font-medium text-foreground">{booking.shops?.name}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Customer: <span className="font-medium">{booking.customer_name}</span> • {booking.customer_phone}
            </p>
            <p className="text-sm text-muted-foreground">
              Qty: {booking.quantity} • Total: ₹{(booking.quantity * (booking.services?.price || 0)).toFixed(2)}
            </p>
          </div>
          {/* <Badge variant="outline" className={getStatusColor(booking.booking_status)}>
            {getStatusIcon(booking.booking_status)}
            <span className="ml-1">{booking.booking_status}</span>
          </Badge> */}
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded px-3 py-2 w-fit">
          <Clock className="w-4 h-4" />
          <span>
            {date} at {time}
          </span>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-3 border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-semibold text-blue-900 dark:text-blue-100">{booking.apartment_name}</p>
              <p className="text-blue-700 dark:text-blue-300">Flat: {booking.flat_number || "N/A"}</p>
              <p className="text-blue-700 dark:text-blue-300">Door: {booking.door_number || "N/A"}</p>
            </div>
          </div>
        </div>

        {booking.notes && <p className="text-xs text-muted-foreground italic">Notes: {booking.notes}</p>}
      </div>
    )
  }

  if (loading) {
    return <div className="text-muted-foreground">Loading bookings...</div>
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Service Bookings - All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-800 dark:text-red-200">
            <p className="font-semibold mb-2">Error loading bookings:</p>
            <p className="text-sm">{error}</p>
            <p className="text-xs mt-3 text-red-700 dark:text-red-300">
              Make sure your Supabase environment variables are set and the bookings table exists.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Bookings - All Orders ({bookings.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No bookings yet</p>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
