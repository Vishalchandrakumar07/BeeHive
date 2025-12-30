import { redirect } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeft } from "lucide-react"
import { createClient } from "@/lib/server"
import { AddApartmentDialog } from "@/components/add-apartment-dialog"
import { DeleteApartmentButton } from "@/components/delete-apartment-button"

export default async function ApartmentsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.user_metadata?.role !== "admin") {
    redirect("/auth/admin/login")
  }

  const { data: apartments } = await supabase.from("apartments").select("*").order("name")

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
            <h1 className="text-2xl font-semibold text-foreground mb-1">Apartments</h1>
            <p className="text-sm text-muted-foreground">Manage apartments in the system</p>
          </div>
          <AddApartmentDialog />
        </div>

        <Card>
          <CardContent className="p-0">
            {!apartments || apartments.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No apartments yet. Add your first apartment!</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apartments.map((apartment) => (
                    <TableRow key={apartment.id}>
                      <TableCell className="font-medium">{apartment.name}</TableCell>
                      <TableCell className="text-muted-foreground">{apartment.address}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(apartment.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <DeleteApartmentButton apartmentId={apartment.id} apartmentName={apartment.name} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
