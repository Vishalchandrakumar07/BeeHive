import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Store, LogOut } from "lucide-react"
import { createClient } from "@/lib/server"
import { AdminBookingsSection } from "@/components/admin-bookings-section"

export default async function AdminDashboard() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.user_metadata?.role !== "admin") {
    redirect("/auth/admin/login")
  }

  const { count: apartmentCount } = await supabase.from("apartments").select("*", { count: "exact", head: true })

  const { count: shopCount } = await supabase.from("shops").select("*", { count: "exact", head: true })

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border bg-card">
        <div className="container max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-foreground">Admin Dashboard</h1>
            <form
              action={async () => {
                "use server"
                const supabase = await createClient()
                await supabase.auth.signOut()
                redirect("/auth/admin/login")
              }}
            >
              <Button variant="outline" size="sm" type="submit">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="flex-1 container max-w-7xl mx-auto px-4 py-6">
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Link href="/admin/apartments">
            <Card className="hover:border-primary transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Apartments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">Add, edit, and manage apartments in the system</p>
                <p className="text-2xl font-semibold text-foreground">{apartmentCount || 0}</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/shops">
            <Card className="hover:border-primary transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="w-5 h-5" />
                  Shops
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">Manage shops and assign them to apartments</p>
                <p className="text-2xl font-semibold text-foreground">{shopCount || 0}</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="mb-8">
          <AdminBookingsSection />
        </div>
      </main>
    </div>
  )
}
