import { redirect } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Store, ChevronLeft, Wrench, Package } from "lucide-react"
import { createClient } from "@/lib/server"
import { FlatNumberForm } from "@/components/flat-number-form"

export default async function ShopListingPage({ params }: { params: Promise<{ apartmentId: string }> }) {
  const { apartmentId } = await params
  const supabase = await createClient()

  const { data: apartment } = await supabase.from("apartments").select("*").eq("id", apartmentId).single()

  if (!apartment) {
    redirect("/")
  }

  const { data: shopApartments } = await supabase
    .from("shop_apartments")
    .select("shop_id, shops!inner(*)")
    .eq("apartment_id", apartmentId)
    .eq("shops.is_active", true)

  const shops = shopApartments?.map((sa: any) => sa.shops) || []

  const shopsWithTypes = await Promise.all(
    shops.map(async (shop: any) => {
      const { data: seller } = await supabase.from("sellers").select("seller_type").eq("id", shop.seller_id).single()
      return { ...shop, seller_type: seller?.seller_type }
    }),
  )

  const productShops = shopsWithTypes.filter((shop) => shop.seller_type === "products")
  const serviceShops = shopsWithTypes.filter((shop) => shop.seller_type === "services")

  return (
    <div className="min-h-screen flex flex-col">
      <FlatNumberForm apartment={apartment} />

      <div className="min-h-screen flex flex-col pb-24">
        <header className="border-b border-border bg-card sticky top-0 z-10">
          <div className="container max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Link>
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{apartment.name}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 container max-w-4xl mx-auto px-4 py-6">
          {productShops.length > 0 && (
            <div className="mb-8">
              <div className="mb-4">
                <h2 className="text-xl font-medium mb-1 text-foreground flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Product Shops
                </h2>
                <p className="text-sm text-muted-foreground">{productShops.length} shops available</p>
              </div>

              <div className="grid gap-3">
                {productShops.map((shop) => (
                  <Link key={shop.id} href={`/customer/${apartmentId}/shop/${shop.id}`} className="block">
                    <Card className="hover:border-primary transition-colors cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="p-2.5 bg-primary/10 rounded-lg">
                            <Store className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-foreground mb-0.5">{shop.name}</h3>
                            <p className="text-sm text-muted-foreground">{shop.category}</p>
                          </div>
                          <div>
                            <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent">
                              Open
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {serviceShops.length > 0 && (
            <div className="mb-8">
              <div className="mb-4">
                <h2 className="text-xl font-medium mb-1 text-foreground flex items-center gap-2">
                  <Wrench className="w-5 h-5" />
                  Service Providers
                </h2>
                <p className="text-sm text-muted-foreground">{serviceShops.length} services available</p>
              </div>

              <div className="grid gap-3">
                {serviceShops.map((shop) => (
                  <Link key={shop.id} href={`/customer/${apartmentId}/shop/${shop.id}`} className="block">
                    <Card className="hover:border-accent transition-colors cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="p-2.5 bg-accent/10 rounded-lg">
                            <Wrench className="w-5 h-5 text-accent" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-foreground mb-0.5">{shop.name}</h3>
                            <p className="text-sm text-muted-foreground">{shop.category}</p>
                          </div>
                          <div>
                            <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent">
                              Available
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {productShops.length === 0 && serviceShops.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No shops or services available for this apartment</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
