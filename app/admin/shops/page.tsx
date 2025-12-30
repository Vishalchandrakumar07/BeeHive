import { redirect } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeft } from "lucide-react"
import { createClient } from "@/lib/server"
import { AssignShopDialog } from "@/components/assign-shop-dialog"
import { AddShopDialog } from "@/components/add-shop-dialog"
import { ToggleShopStatus } from "@/components/toggle-shop-status"

export default async function ShopsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.user_metadata?.role !== "admin") {
    redirect("/auth/admin/login")
  }

  const { data: shops } = await supabase
    .from("shops")
    .select("*, sellers(service_provider_name, seller_type)")
    .order("created_at", { ascending: false })

  const shopsWithApartments = await Promise.all(
    (shops || []).map(async (shop) => {
      const { data: shopApartments } = await supabase
        .from("shop_apartments")
        .select("apartments(id, name)")
        .eq("shop_id", shop.id)

      return {
        ...shop,
        apartmentAssociations: shopApartments?.map((sa: any) => sa.apartments) || [],
      }
    }),
  )

  const { data: apartments } = await supabase.from("apartments").select("id, name").order("name")

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border bg-card">
        <div className="container max-w-7xl mx-auto px-4 py-4">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="flex-1 container max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-foreground mb-1">Shops & Service Providers</h1>
            <p className="text-sm text-muted-foreground">Manage shops and their apartment assignments</p>
          </div>
          <AddShopDialog apartments={apartments || []} />
        </div>

        <Card>
          <CardContent className="p-0">
            {!shopsWithApartments || shopsWithApartments.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No shops registered yet. Add shops manually or wait for sellers to sign up.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Shop Name</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Apartments</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {shopsWithApartments.map((shop) => (
                      <TableRow key={shop.id}>
                        <TableCell className="font-medium">{shop.name}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {shop.sellers?.service_provider_name || "N/A"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{shop.sellers?.seller_type || "Unknown"}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{shop.category}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{shop.phone}</TableCell>
                        <TableCell>
                          <ToggleShopStatus shopId={shop.id} isActive={shop.is_active} />
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {shop.apartmentAssociations.length > 0
                            ? shop.apartmentAssociations.map((apt: any) => apt.name).join(", ")
                            : "Not assigned"}
                        </TableCell>
                        <TableCell className="text-right">
                          <AssignShopDialog
                            shop={shop}
                            apartments={apartments || []}
                            currentApartments={shop.apartmentAssociations}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
